import { adapterRegistry } from '../adapters/index.js';
import { priceHistoryService } from './priceHistory.service.js';

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
  /**
   * Helper to determine whether an offer is currently in stock and available for purchase
   * @param {Object} offer
   * @returns {boolean}
   */
  isOfferAvailable(offer) {
    if (!offer || typeof offer.price !== 'number' || isNaN(offer.price) || offer.price <= 0) {
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
   * Search and compare across all enabled store adapters
   * @param {string} query - Search keyword
   * @param {Object} options - Filtering / sorting options
   */
  async compareQuery(query, options = {}) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      throw new Error('Search query must be at least 2 characters long.');
    }

    // Resolve canonical product identity if query matches a known catalog item
    const canonicalProduct = this.resolveCanonicalProduct(cleanQuery);
    const adapters = adapterRegistry.getAll();
    const startTime = Date.now();

    // 1. Query all adapters concurrently with fault tolerance & status tracking
    const storeStatuses = [];
    const allOffers = [];

    const settledResults = await Promise.allSettled(
      adapters.map(async (adapter) => {
        try {
          const offers = await adapter.search(cleanQuery);
          return {
            store: adapter.name,
            slug: adapter.slug,
            status: 'active',
            offers: Array.isArray(offers) ? offers : []
          };
        } catch (err) {
          console.warn(`[StoreAdapter] ${adapter.name} search error:`, err.message);
          return {
            store: adapter.name,
            slug: adapter.slug,
            status: 'failed',
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

    const failedStores = storeStatuses.filter((s) => s.status === 'failed');

    if (allOffers.length === 0) {
      return {
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
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }

    // 2. Deduplicate offers by (store + title)
    const seen = new Set();
    const uniqueOffers = allOffers.filter((offer) => {
      const key = `${offer.store.toLowerCase()}-${offer.title.toLowerCase().replace(/\s+/g, '')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 3. Sort offers ascending by current selling price
    const sortedOffers = [...uniqueOffers].sort((a, b) => a.price - b.price);

    // 4. Determine Best Deal: Lowest valid price among AVAILABLE offers
    const availableOffers = sortedOffers.filter((o) => this.isOfferAvailable(o));
    const bestOffer = availableOffers.length > 0 ? availableOffers[0] : null;

    const bestDeal = bestOffer
      ? {
          store: bestOffer.store,
          price: bestOffer.price,
          originalPrice: bestOffer.originalPrice,
          discount: bestOffer.discount,
          productUrl: bestOffer.productUrl,
          imageUrl: bestOffer.imageUrl,
          availability: bestOffer.availability,
          title: bestOffer.title
        }
      : null;

    // 5. Compute store metrics
    const lowestPrice = bestOffer ? bestOffer.price : sortedOffers[0].price;
    const highestPrice = Math.max(...sortedOffers.map((o) => o.price));
    const maxSavings = Math.max(0, highestPrice - lowestPrice);

    // 6. Enrich with visual calculation metrics and canonical product association
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
      enrichedOffers.find((o) => o.imageUrl)?.imageUrl ||
      '';

    // 7. If this search resolves to a verified canonical product, record snapshots
    if (canonicalProduct && enrichedOffers.length > 0) {
      priceHistoryService
        .saveOffersBatch(canonicalProduct.id, enrichedOffers, canonicalProduct.name)
        .catch((e) => {
          console.warn('[ComparisonService] Snapshot save error on search:', e.message);
        });
    }

    return {
      query: cleanQuery,
      productId: canonicalProduct ? canonicalProduct.id : null,
      productName: canonicalProduct ? canonicalProduct.name : (enrichedOffers[0]?.title || cleanQuery),
      imageUrl: topImageUrl,
      isCanonicalProduct: Boolean(canonicalProduct),
      totalStoresChecked: adapters.length,
      storesAvailable: enrichedOffers.length,
      resultsCount: enrichedOffers.length,
      bestDeal,
      lowestPrice,
      highestPrice,
      maxSavings,
      offers: enrichedOffers,
      storesChecked: adapters.map((a) => a.name),
      storeStatuses,
      failedStores: failedStores.map((f) => ({ store: f.store, error: f.error })),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
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
      productId: canonicalProduct ? canonicalProduct.id : null,
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
