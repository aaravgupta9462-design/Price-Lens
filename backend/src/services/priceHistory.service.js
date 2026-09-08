import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_FILE = path.resolve(__dirname, '../../data/price_history.json');

// Ensure local data directory exists for resilient persistence
function ensureLocalStore() {
  const dir = path.dirname(LOCAL_STORE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORE_FILE)) {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

function readLocalHistory() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function writeLocalHistory(data) {
  ensureLocalStore();
  fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export class PriceHistoryService {
  /**
   * Minimum window (in milliseconds) to avoid redundant identical snapshots.
   * Default: 6 hours (6 * 60 * 60 * 1000).
   */
  DEDUP_WINDOW_MS = 6 * 60 * 60 * 1000;

  /**
   * Save a single historical price snapshot for a product and store.
   * Prevents unnecessary duplicates if price hasn't changed within DEDUP_WINDOW_MS.
   */
  async savePriceSnapshot({ productId, store, price, currency = 'INR', title = '' }) {
    if (!productId || !store || price == null || isNaN(price) || price <= 0) {
      return null;
    }

    const cleanProductId = String(productId).trim();
    const cleanStore = String(store).trim();
    const cleanPrice = Math.round(Number(price));
    const now = new Date();

    // 1. Try Prisma/PostgreSQL if available
    let savedToPrisma = false;
    if (prisma) {
      try {
        // Check most recent record in database
        const latest = await prisma.priceHistory.findFirst({
          where: { productId: cleanProductId, store: cleanStore },
          orderBy: { recordedAt: 'desc' }
        });

        // Deduplication check: same price within dedup window
        if (latest && latest.price === cleanPrice) {
          const timeSince = now.getTime() - new Date(latest.recordedAt).getTime();
          if (timeSince < this.DEDUP_WINDOW_MS) {
            return { skipped: true, reason: 'DUPLICATE_WITHIN_WINDOW', record: latest };
          }
        }

        // Upsert Product record to maintain foreign key constraint
        await prisma.product.upsert({
          where: { id: cleanProductId },
          update: { updatedAt: now },
          create: {
            id: cleanProductId,
            name: title || cleanProductId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          }
        });

        // Create new PriceHistory snapshot
        const record = await prisma.priceHistory.create({
          data: {
            productId: cleanProductId,
            store: cleanStore,
            price: cleanPrice,
            currency,
            recordedAt: now
          }
        });

        savedToPrisma = true;
        return { success: true, storage: 'prisma', record };
      } catch (prismaErr) {
        // Graceful fallback to persistent JSON ledger if DB is offline
        // console.debug('[PriceHistory] Prisma offline, using fallback ledger:', prismaErr.message);
      }
    }

    // 2. Persistent Local Storage Fallback
    const localData = readLocalHistory();
    if (!localData[cleanProductId]) {
      localData[cleanProductId] = [];
    }

    const records = localData[cleanProductId];
    const latestLocal = [...records]
      .filter((r) => r.store.toLowerCase() === cleanStore.toLowerCase())
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];

    // Deduplication check on local ledger
    if (latestLocal && latestLocal.price === cleanPrice) {
      const timeSince = now.getTime() - new Date(latestLocal.recordedAt).getTime();
      if (timeSince < this.DEDUP_WINDOW_MS) {
        return { skipped: true, reason: 'DUPLICATE_WITHIN_WINDOW', record: latestLocal };
      }
    }

    const newRecord = {
      id: `ph_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: cleanProductId,
      store: cleanStore,
      price: cleanPrice,
      currency,
      recordedAt: now.toISOString()
    };

    records.push(newRecord);
    writeLocalHistory(localData);

    return { success: true, storage: 'local_persistence', record: newRecord };
  }

  /**
   * Save multiple price snapshots from store adapter results
   */
  async saveOffersBatch(productId, offers, title = '') {
    if (!productId || !Array.isArray(offers)) return [];

    const results = [];
    for (const offer of offers) {
      try {
        const res = await this.savePriceSnapshot({
          productId,
          store: offer.store,
          price: offer.price,
          currency: offer.currency || 'INR',
          title: title || offer.title
        });
        if (res) results.push(res);
      } catch (err) {
        console.warn('[PriceHistory] Batch snapshot item error:', err.message);
      }
    }
    return results;
  }

  /**
   * Retrieve historical prices and calculate analysis metrics
   */
  async getHistoricalPrices(productId, { timeline = '30D' } = {}) {
    const cleanProductId = String(productId || '').trim();
    if (!cleanProductId) {
      throw new Error('Valid Product ID is required.');
    }

    let allRecords = [];

    // 1. Query Prisma first
    if (prisma) {
      try {
        allRecords = await prisma.priceHistory.findMany({
          where: { productId: cleanProductId },
          orderBy: { recordedAt: 'asc' }
        });
      } catch (err) {
        // Fall back to local ledger
      }
    }

    // 2. If Prisma returned empty or failed, check local persistence
    if (!allRecords || allRecords.length === 0) {
      const localData = readLocalHistory();
      allRecords = (localData[cleanProductId] || []).sort(
        (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
      );
    }

    // If no history exists at all:
    if (allRecords.length === 0) {
      return {
        productId: cleanProductId,
        hasHistory: false,
        message: 'Price history will appear as Price Lens tracks this product.',
        timeline,
        currentPrice: null,
        lowestPrice: null,
        highestPrice: null,
        averagePrice: null,
        ninetyDayLowest: null,
        ninetyDayHighest: null,
        priceChangePercentage: 0,
        totalSnapshots: 0,
        points: []
      };
    }

    // 3. Compute Time Windows
    const now = new Date();
    const daysMap = {
      '7D': 7,
      '30D': 30,
      '90D': 90,
      '3M': 90,
      '6M': 180,
      'ALL': 3650
    };

    const windowDays = daysMap[timeline.toUpperCase()] || 30;
    const windowStart = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Records within selected timeline
    const timelineRecords = allRecords.filter(
      (r) => new Date(r.recordedAt) >= windowStart
    );

    // Use timeline records if available, otherwise use all available records
    const workingSet = timelineRecords.length > 0 ? timelineRecords : allRecords;

    // 4. Calculate Core Metrics
    const allPrices = allRecords.map((r) => r.price);
    const workingPrices = workingSet.map((r) => r.price);

    // 90-day records
    const ninetyDayRecords = allRecords.filter(
      (r) => new Date(r.recordedAt) >= ninetyDaysAgo
    );
    const ninetyDayPrices =
      ninetyDayRecords.length > 0 ? ninetyDayRecords.map((r) => r.price) : workingPrices;

    const allTimeLowest = Math.min(...allPrices);
    const allTimeHighest = Math.max(...allPrices);
    const ninetyDayLowest = Math.min(...ninetyDayPrices);
    const ninetyDayHighest = Math.max(...ninetyDayPrices);

    // Calculate currentPrice: minimum price among the most recent snapshot cycle across stores
    const latestSnapshotPerStore = new Map();
    allRecords.forEach((record) => {
      const storeKey = record.store.toLowerCase();
      const existing = latestSnapshotPerStore.get(storeKey);
      if (!existing || new Date(record.recordedAt) > new Date(existing.recordedAt)) {
        latestSnapshotPerStore.set(storeKey, record);
      }
    });

    const currentStorePrices = Array.from(latestSnapshotPerStore.values()).map((s) => s.price);
    const currentPrice = currentStorePrices.length > 0
      ? Math.min(...currentStorePrices)
      : allRecords[allRecords.length - 1].price;
    const latestRecord = allRecords[allRecords.length - 1];

    // Average price in selected window
    const sum = workingPrices.reduce((acc, p) => acc + p, 0);
    const averagePrice = Math.round(sum / workingPrices.length);

    // Price change percentage over the timeline
    const firstPriceInWindow = workingPrices[0];
    const priceChangePercentage =
      firstPriceInWindow > 0
        ? Number((((currentPrice - firstPriceInWindow) / firstPriceInWindow) * 100).toFixed(1))
        : 0;

    // 5. Generate Chart Points
    // Group records by calendar day / label to avoid clumping
    const pointsMap = new Map();

    workingSet.forEach((record) => {
      const dateObj = new Date(record.recordedAt);
      const dayKey = dateObj.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });

      // If multiple store snapshots on the same day, keep the lowest store price for that day
      if (!pointsMap.has(dayKey) || record.price < pointsMap.get(dayKey).price) {
        pointsMap.set(dayKey, {
          label: dayKey,
          price: record.price,
          store: record.store,
          date: record.recordedAt,
          isDevelopmentProvider: Boolean(record.isDevelopmentProvider ?? true)
        });
      }
    });

    const points = Array.from(pointsMap.values());

    return {
      productId: cleanProductId,
      hasHistory: true,
      timeline,
      currentPrice,
      lowestPrice: allTimeLowest,
      highestPrice: allTimeHighest,
      ninetyDayLowest,
      ninetyDayHighest,
      averagePrice,
      priceChangePercentage,
      totalSnapshots: allRecords.length,
      latestSnapshotDate: latestRecord.recordedAt,
      points
    };
  }
}

export const priceHistoryService = new PriceHistoryService();
export default priceHistoryService;
