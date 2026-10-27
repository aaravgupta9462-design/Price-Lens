import { AmazonAdapter } from './stores/amazonAdapter.js';
import { FlipkartAdapter } from './stores/flipkartAdapter.js';
import { CromaAdapter } from './stores/cromaAdapter.js';
import { RelianceAdapter } from './stores/relianceAdapter.js';
import { MyntraAdapter } from './stores/myntraAdapter.js';
import { TataCliqAdapter } from './stores/tatacliqAdapter.js';
import { VijaySalesAdapter } from './stores/vijaysalesAdapter.js';
import { calculateMatchScore, classifyMatch } from '../common/productMatcher.js';
import { cacheService } from '../common/cacheService.js';

class StoreRegistry {
  constructor() {
    this.adapters = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    this.register(new AmazonAdapter());
    this.register(new FlipkartAdapter());
    this.register(new CromaAdapter());
    this.register(new RelianceAdapter());
    this.register(new MyntraAdapter());
    this.register(new TataCliqAdapter());
    this.register(new VijaySalesAdapter());
  }

  register(adapter) {
    this.adapters.set(adapter.storeCode, adapter);
  }

  getAdapter(storeCode) {
    return this.adapters.get((storeCode || '').toLowerCase());
  }

  getAllAdapters() {
    return Array.from(this.adapters.values());
  }

  // Get status overview for admin panel
  getStoreStatuses() {
    return this.getAllAdapters().map((adapter) => {
      const customStatus = typeof adapter.getStatus === 'function' ? adapter.getStatus() : null;
      const isConfig = adapter.isConfigured();
      const status = customStatus || (isConfig ? 'CONNECTED' : 'NOT_CONFIGURED');
      return {
        code: adapter.storeCode,
        name: adapter.storeName,
        emoji: adapter.emoji,
        color: adapter.color,
        isConfigured: isConfig,
        status: status,
        statusText: status === 'CONNECTED' ? 'API Ready' : status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'API Key Required'
      };
    });
  }

  // Search across all stores with failure isolation & product matching
  async compareAcrossStores(sourceProduct) {
    const cacheKey = `comp_${sourceProduct.title}_${sourceProduct.brand}_${sourceProduct.variant}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return { ...cached, isCached: true };
    }

    const results = [];
    const errors = [];

    const storePromises = this.getAllAdapters().map(async (adapter) => {
      if (cacheService.isCircuitOpen(adapter.storeCode)) {
        errors.push({ store: adapter.storeName, message: 'Store API circuit breaker active' });
        return null;
      }

      try {
        let offer = null;
        if (adapter.storeCode === sourceProduct.storeCode) {
          offer = sourceProduct;
        } else {
          const searchRes = await adapter.searchProducts(sourceProduct.title);
          if (Array.isArray(searchRes) && searchRes.length > 0) {
            offer = searchRes[0];
          } else if (searchRes && !Array.isArray(searchRes)) {
            offer = searchRes;
          }
        }

        if (offer) {
          const confidenceScore = calculateMatchScore(sourceProduct, offer);
          const matchClassification = classifyMatch(confidenceScore);

          cacheService.recordSuccess(adapter.storeCode);
          return {
            ...offer,
            confidenceScore,
            matchType: matchClassification.type,
            matchLabel: matchClassification.label,
            isBestPrice: false
          };
        }
      } catch (err) {
        cacheService.recordFailure(adapter.storeCode);
        errors.push({ store: adapter.storeName, message: err.message || 'Fetch failed' });
      }
      return null;
    });

    const settled = await Promise.allSettled(storePromises);
    settled.forEach((res) => {
      if (res.status === 'fulfilled' && res.value) {
        results.push(res.value);
      }
    });

    // Filter valid matches (score >= 70) and sort by lowest price
    const validOffers = results
      .filter((r) => r.confidenceScore >= 70)
      .sort((a, b) => a.price - b.price);

    if (validOffers.length > 0) {
      validOffers[0].isBestPrice = true;
    }

    const lowestPrice = validOffers.length > 0 ? validOffers[0].price : sourceProduct.price;
    const highestPrice = validOffers.length > 0 ? Math.max(...validOffers.map((o) => o.price)) : sourceProduct.price;
    const maxSavings = Math.max(highestPrice - lowestPrice, 0);

    const payload = {
      sourceProduct,
      offers: validOffers,
      lowestPrice,
      highestPrice,
      maxSavings,
      storesChecked: this.adapters.size,
      storesResponded: validOffers.length,
      errors,
      updatedAt: new Date().toISOString()
    };

    cacheService.set(cacheKey, payload, 600); // 10 minutes cache
    return payload;
  }
}

export const storeRegistry = new StoreRegistry();
