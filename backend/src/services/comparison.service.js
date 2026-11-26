import { adapterRegistry } from '../adapters/index.js';
import { priceHistoryService } from './priceHistory.service.js';
import { cacheService } from '../utils/cache.util.js';
import { logger } from '../utils/logger.util.js';
import { filterComparisonOffersWithReport, FILTER_VERSION } from '../utils/resultFilter.js';
import { mergeAndDeduplicateOffers, normalizeStoreKey } from '../utils/offerDeduplicator.js';

/**
 * Registry of known canonical products matching frontend catalog identities.
 * Extensible for future product ingestion from databases or catalog APIs.
 */
export const KNOWN_CANONICAL_PRODUCTS = [
  {
    id: 'iphone-16-128',
    name: 'iPhone 16 128GB',
    imageUrl: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
    keywords: ['iphone 16 128', 'iphone 16', 'apple iphone 16', 'iphone']
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3',
    imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqzpDL._SX679_.jpg',
    keywords: ['macbook air m3', 'macbook m3', 'macbook air', 'macbook']
  },
  {
    id: 'samsung-s25',
    name: 'Samsung Galaxy S25',
    imageUrl: 'https://m.media-amazon.com/images/I/71xL8-5XhQL._SX679_.jpg',
    keywords: ['samsung galaxy s25', 'galaxy s25', 'samsung s25', 's25 5g', 'galaxy s25 5g', 'samsung']
  },
  {
    id: 'sony-xm5',
    name: 'Sony WH-1000XM5',
    imageUrl: 'https://m.media-amazon.com/images/I/61+btxzpfDL._SX679_.jpg',
    keywords: ['wh-1000xm5', 'sony xm5', 'sony wh-1000xm5', 'sony wh 1000xm5', 'xm5', 'sony headphones', 'sony']
  },
  {
    id: 'apple-watch-s10',
    name: 'Apple Watch Series 10',
    imageUrl: 'https://m.media-amazon.com/images/I/71s6Vw6Rj2L._SX679_.jpg',
    keywords: ['apple watch series 10', 'watch series 10', 'apple watch s10', 'apple watch', 'watch 10', 'series 10']
  },
  {
    id: 'dyson-v12',
    name: 'Dyson V12 Detect Slim',
    imageUrl: 'https://m.media-amazon.com/images/I/61Nl-U0N+hL._SX679_.jpg',
    keywords: ['dyson v12 detect slim', 'dyson v12', 'dyson vacuum', 'dyson']
  }
];

export class ComparisonService {
  constructor() {
    this.defaultTimeoutMs = parseInt(process.env.ADAPTER_TIMEOUT_MS || '8000', 10);
    this.cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS || '600', 10);
  }

  /**
   * Helper to determine whether an offer is currently in stock and available for purchase
   * @param {Object} offer
   * @returns {boolean}
   */
  isOfferAvailable(offer) {
    if (!offer || typeof offer.price !== 'number' || isNaN(offer.price) || offer.price <= 0) {
      return false;
    }
    if (offer.inStock === false) {
      return false;
    }
    const avail = String(offer.availability || '').toLowerCase();
    if (
      avail.includes('out of stock') ||
      avail.includes('unavailable') ||
      avail.includes('sold out') ||
      avail.includes('currently unavailable')
    ) {
      return false;
    }
    return true;
  }

  /**
   * Resolve a query or ID to a known canonical product identity.
   * Returns null if no canonical match is found (avoids inventing arbitrary IDs).
   * @param {string} queryOrId
   * @returns {{ id: string, name: string, imageUrl: string } | null}
   */
  resolveCanonicalProduct(queryOrId) {
    if (!queryOrId) return null;
    const q = String(queryOrId).toLowerCase().trim();

    // 1. Direct ID match
    const directMatch = KNOWN_CANONICAL_PRODUCTS.find((p) => p.id.toLowerCase() === q);
    if (directMatch) {
      return { id: directMatch.id, name: directMatch.name, imageUrl: directMatch.imageUrl };
    }

    // 2. Exact keyword / phrase matching
    for (const prod of KNOWN_CANONICAL_PRODUCTS) {
      for (const kw of prod.keywords) {
        if (q === kw || q.includes(kw) || (q.length >= 4 && kw.includes(q))) {
          return { id: prod.id, name: prod.name, imageUrl: prod.imageUrl };
        }
      }
    }

    return null;
  }

  /**
   * Wrap promise execution with a strict timeout
   */
  withTimeout(promise, ms, label) {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`${label} execution timed out after ${ms}ms`));
      }, ms);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      clearTimeout(timer);
    });
  }

  /**
   * Search and compare across all enabled store adapters
   * @param {string} query - Search keyword
   * @param {Object} options - Filtering / caching options
   */
  async compareQuery(query, options = {}) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      throw new Error('Search query must be at least 2 characters long.');
    }

    // 1. Check in-memory TTL cache for RAW adapter offers (with query + filter version)
    const rawCacheKey = `compare:raw:${cleanQuery.toLowerCase()}:v${FILTER_VERSION}`;
    let allOffers = [];
    let storeStatuses = [];
    let failedStores = [];
    let isCached = false;
    let cachedAt = undefined;

    if (!options.bypassCache) {
      const cachedRaw = await cacheService.get(rawCacheKey);
      if (cachedRaw && Array.isArray(cachedRaw.allOffers)) {
        allOffers = cachedRaw.allOffers;
        storeStatuses = cachedRaw.storeStatuses || [];
        failedStores = cachedRaw.failedStores || [];
        isCached = true;
        cachedAt = cachedRaw.cachedAt || new Date().toISOString();
      }
    }

    // Resolve canonical product identity if query matches a known catalog item
    const canonicalProduct = this.resolveCanonicalProduct(cleanQuery);
    const adapters = adapterRegistry.getAll();
    const startTime = Date.now();

    // 2. Query all enabled adapters only if raw data is not cached
    if (!isCached) {
      const settledResults = await Promise.allSettled(
        adapters.map(async (adapter) => {
          try {
            const offers = await this.withTimeout(
              adapter.search(cleanQuery),
              this.defaultTimeoutMs,
              adapter.name
            );
            return {
              store: adapter.name,
              slug: adapter.slug,
              status: 'active',
              offers: Array.isArray(offers) ? offers : []
            };
          } catch (err) {
            const isTimeout = err.message && err.message.includes('timed out');
            console.warn(`[StoreAdapter] ${adapter.name} search warning:`, err.message);
            return {
              store: adapter.name,
              slug: adapter.slug,
              status: isTimeout ? 'timed_out' : 'failed',
              error: err.message || 'Store adapter error',
              offers: []
            };
          }
        })
      );

      settledResults.forEach((res, index) => {
        const adapter = adapters[index];
        if (res.status === 'fulfilled') {
          const { store, slug, status, error, offers } = res.value;
          storeStatuses.push({
            store: store || adapter.name,
            slug: slug || adapter.slug,
            status,
            ...(error ? { error } : {}),
            offersCount: offers.length
          });
          allOffers.push(...offers);
        } else {
          storeStatuses.push({
            store: adapter.name,
            slug: adapter.slug,
            status: 'failed',
            error: res.reason?.message || 'Adapter query failed',
            offersCount: 0
          });
        }
      });

      failedStores = storeStatuses.filter((s) => s.status !== 'active');

      // Deduplicate direct retailer API offers vs aggregator (SerpApi) offers, prioritizing direct API
      allOffers = mergeAndDeduplicateOffers(allOffers);

      // Save RAW adapter offers to in-memory TTL cache (rules can change while raw data stays cached)
      if (allOffers.length > 0) {
        cachedAt = new Date().toISOString();
        await cacheService.set(
          rawCacheKey,
          {
            allOffers,
            storeStatuses,
            failedStores,
            cachedAt
          },
          this.cacheTtlSeconds
        );
      }
    }

    if (allOffers.length === 0) {
      const emptyResult = {
        query: cleanQuery,
        productId: canonicalProduct ? canonicalProduct.id : null,
        productName: canonicalProduct ? canonicalProduct.name : cleanQuery,
        imageUrl: canonicalProduct?.imageUrl || '',
        isCanonicalProduct: Boolean(canonicalProduct),
        totalStoresChecked: adapters.length,
        storesAvailable: 0,
        resultsCount: 0,
        bestDeal: null,
        lowestPrice: 0,
        highestPrice: 0,
        maxSavings: 0,
        offers: [],
        storesChecked: adapters.map((a) => a.name),
        storeStatuses,
        failedStores: failedStores.map((f) => ({ store: f.store, error: f.error })),
        filterStats: null,
        ...(isCached ? { isCached: true, cachedAt } : {}),
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
      return emptyResult;
    }

    // 3. Filter raw offers: remove accessories, banned stores, variant mismatches, irrelevant titles, price outliers
    const { passedOffers, filteredOut, stats: filterStats, lowConfidence, confidenceMessage } =
      filterComparisonOffersWithReport(allOffers, cleanQuery);
    logger.info(`[ResultFilter] Query "${cleanQuery}": passed ${passedOffers.length}/${allOffers.length} offers`, filterStats);

    const candidates = passedOffers;

    if (candidates.length === 0) {
      const emptyResult = {
        query: cleanQuery,
        productId: canonicalProduct ? canonicalProduct.id : null,
        productName: canonicalProduct ? canonicalProduct.name : cleanQuery,
        imageUrl: canonicalProduct?.imageUrl || '',
        isCanonicalProduct: Boolean(canonicalProduct),
        totalStoresChecked: adapters.length,
        storesAvailable: 0,
        resultsCount: 0,
        lowConfidence: true,
        confidenceMessage: 'Kam reliable results mile',
        bestDeal: null,
        lowestPrice: 0,
        highestPrice: 0,
        maxSavings: 0,
        offers: [],
        storesChecked: adapters.map((a) => a.name),
        storeStatuses,
        failedStores: failedStores.map((f) => ({ store: f.store, error: f.error })),
        filterStats,
        ...(isCached ? { isCached: true, cachedAt } : {}),
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
      return emptyResult;
    }

    // 4. Deduplicate offers: keep lowest price offer per store (prioritizing direct API and availability)
    const storeMap = new Map();
    for (const offer of candidates) {
      const storeKey = normalizeStoreKey(offer.storeSlug, offer.store);
      if (!storeMap.has(storeKey)) {
        storeMap.set(storeKey, offer);
      } else {
        const existing = storeMap.get(storeKey);
        const currentAvail = this.isOfferAvailable(offer);
        const existingAvail = this.isOfferAvailable(existing);
        const currentIsDirect = Boolean(offer.isDirectApi || offer.isDirect);
        const existingIsDirect = Boolean(existing.isDirectApi || existing.isDirect);

        if (currentAvail && !existingAvail) {
          storeMap.set(storeKey, offer);
        } else if (!currentAvail && existingAvail) {
          // Keep existing available offer
        } else if (currentIsDirect && !existingIsDirect) {
          // Direct API takes priority over aggregator for the same store
          storeMap.set(storeKey, offer);
        } else if (!currentIsDirect && existingIsDirect) {
          // Keep existing direct offer
        } else if (currentAvail === existingAvail && offer.price < existing.price) {
          storeMap.set(storeKey, offer);
        }
      }
    }
    const uniqueOffers = Array.from(storeMap.values());

    // 4. Sort offers ascending by current selling price
    const sortedOffers = [...uniqueOffers].sort((a, b) => a.price - b.price);

    // 5. Determine Best Deal: Lowest valid price among AVAILABLE offers
    const availableOffers = sortedOffers.filter((o) => this.isOfferAvailable(o));
    const bestOffer = availableOffers.length > 0 ? availableOffers[0] : (sortedOffers[0] || null);

    const bestDeal = bestOffer
      ? {
          store: bestOffer.store,
          storeSlug: bestOffer.storeSlug,
          storeEmoji: bestOffer.storeEmoji,
          price: bestOffer.price,
          originalPrice: bestOffer.originalPrice,
          discount: bestOffer.discount,
          productUrl: bestOffer.productUrl || bestOffer.url,
          imageUrl: bestOffer.imageUrl || bestOffer.image,
          availability: bestOffer.availability,
          title: bestOffer.title
        }
      : null;

    // 6. Compute store metrics
    const lowestPrice = bestOffer ? bestOffer.price : (sortedOffers[0]?.price || 0);
    const highestPrice = sortedOffers.length > 0 ? Math.max(...sortedOffers.map((o) => o.price)) : lowestPrice;
    const maxSavings = Math.max(0, highestPrice - lowestPrice);

    // 7. Enrich with visual calculation metrics and canonical product association
    const enrichedOffers = sortedOffers.map((offer) => {
      const isAvailable = this.isOfferAvailable(offer);
      const isBestPrice = Boolean(
        isAvailable && bestOffer && offer.store === bestOffer.store && offer.price === bestOffer.price
      );
      const barPercent =
        highestPrice === lowestPrice
          ? 75
          : Math.round(60 + ((offer.price - lowestPrice) / (highestPrice - lowestPrice)) * 38);

      return {
        ...offer,
        productId: canonicalProduct ? canonicalProduct.id : null,
        isBestPrice,
        isAvailable,
        priceDifference: Math.max(0, offer.price - lowestPrice),
        barPercent: Math.min(100, Math.max(40, barPercent))
      };
    });

    const topImageUrl =
      (canonicalProduct && canonicalProduct.imageUrl) ||
      enrichedOffers.find((o) => o.imageUrl || o.image)?.imageUrl ||
      '';

    // 8. If this search resolves to a verified canonical product or has offers, record snapshots
    const resolvedProdId = canonicalProduct ? canonicalProduct.id : cleanQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const resolvedProdName = canonicalProduct ? canonicalProduct.name : (enrichedOffers[0]?.title || cleanQuery);

    if (enrichedOffers.length > 0) {
      priceHistoryService
        .saveOffersBatch(resolvedProdId, enrichedOffers, resolvedProdName)
        .catch((e) => {
          console.warn('[ComparisonService] Snapshot save warning on search:', e.message);
        });
    }

    const finalResult = {
      query: cleanQuery,
      productId: canonicalProduct ? canonicalProduct.id : resolvedProdId,
      productName: resolvedProdName,
      imageUrl: topImageUrl,
      isCanonicalProduct: Boolean(canonicalProduct),
      totalStoresChecked: adapters.length,
      storesAvailable: enrichedOffers.length,
      resultsCount: enrichedOffers.length,
      lowConfidence: Boolean(lowConfidence ?? filterStats?.lowConfidence),
      confidenceMessage: confidenceMessage || filterStats?.confidenceMessage || null,
      refurbishedCount: filterStats?.refurbishedCount || 0,
      bestDeal,
      lowestPrice,
      highestPrice,
      maxSavings,
      offers: enrichedOffers,
      storesChecked: adapters.map((a) => a.name),
      storeStatuses,
      failedStores: failedStores.map((f) => ({ store: f.store, error: f.error })),
      filterStats,
      rejectedOffers: (filteredOut || []).map((f) => ({
        store: f.offer?.store || 'Unknown',
        title: f.offer?.title || '',
        price: f.offer?.price || 0,
        reason: f.reason,
        detail: f.detail
      })),
      ...(isCached ? { isCached: true, cachedAt } : {}),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };

    return finalResult;
  }

  /**
   * Compare offers specifically for a catalog product by ID
   * @param {string} productId
   */
  async compareByProductId(productId) {
    const cleanId = String(productId || '').trim();
    const canonicalProduct = this.resolveCanonicalProduct(cleanId);

    // If it's a known product, use its full name for store query; otherwise use the raw ID
    const query = canonicalProduct ? canonicalProduct.name : cleanId.replace(/-/g, ' ');
    const result = await this.compareQuery(query);

    return {
      ...result,
      productId: canonicalProduct ? canonicalProduct.id : cleanId,
      productName: canonicalProduct ? canonicalProduct.name : query,
      isCanonicalProduct: Boolean(canonicalProduct)
    };
  }

  /**
   * List all enabled stores
   */
  getStores() {
    return adapterRegistry.getStoreMetadata();
  }
}

export const comparisonService = new ComparisonService();
export default comparisonService;
