/**
 * BaseStoreAdapter
 * 
 * Abstract base class defining the contract for all e-commerce store adapters.
 * Every retailer (Amazon, Flipkart, Croma, Reliance Digital, etc.) extends this base
 * and returns a strictly normalized product offer structure.
 */

export class BaseStoreAdapter {
  /**
   * @param {string} name - Human-readable store name (e.g. 'Amazon')
   * @param {string} slug - Unique store identifier (e.g. 'amazon')
   * @param {Object} options - Store options and configuration
   */
  constructor(name, slug, options = {}) {
    if (new.target === BaseStoreAdapter) {
      throw new TypeError('Cannot construct BaseStoreAdapter instances directly.');
    }
    this.name = name;
    this.slug = slug;
    this.emoji = options.emoji || '🏬';
    this.isDevelopmentProvider = options.isDevelopmentProvider ?? true;
    this.config = options.config || {};
  }

  /**
   * Search for products matching a query
   * @param {string} query - Product search query
   * @returns {Promise<Array<NormalizedOffer>>}
   */
  async search(query) {
    throw new Error(`search() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Fetch specific product offer by product ID or direct URL
   * @param {string} productId - Product identifier
   * @returns {Promise<NormalizedOffer|null>}
   */
  async getProductOffer(productId) {
    throw new Error(`getProductOffer() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Find the single best matching catalog entry for a search query
   * Prevents multi-product pollution where generic terms match multiple products
   * @param {string} query
   * @param {Array} catalog
   * @returns {Object|null} Best matching catalog item or null
   */
  findBestCatalogMatch(query, catalog) {
    const q = String(query || '').toLowerCase().trim();
    if (!q || !Array.isArray(catalog)) return null;

    let bestScore = 0;
    let bestItem = null;

    const queryWords = q.split(/[\s-]+/).filter((w) => w.length > 1);

    for (const item of catalog) {
      let score = 0;
      for (const k of item.matchKeys) {
        const keyLower = String(k).toLowerCase();
        if (q === keyLower) {
          score = Math.max(score, 100);
        } else if (q.includes(keyLower)) {
          score = Math.max(score, 50 + keyLower.length * 2);
        } else if (keyLower.includes(q) && q.length >= 3) {
          score = Math.max(score, 30 + q.length * 2);
        }
      }

      // Also count matching words
      let wordMatches = 0;
      for (const word of queryWords) {
        if (item.matchKeys.some((k) => k.toLowerCase() === word || k.toLowerCase().includes(word))) {
          wordMatches++;
        }
      }
      if (wordMatches > 0) {
        score += wordMatches * 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    return bestScore > 0 ? bestItem : null;
  }

  /**
   * Normalizes raw store output into the standard PriceLens offer schema
   * @param {Object} raw
   * @returns {Object} Normalized offer
   */
  normalizeOffer(raw) {
    const price = Math.round(Number(raw.price) || 0);
    const originalPrice = Math.round(Number(raw.originalPrice) || price);
    const discount = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : (Number(raw.discount) || 0);

    return {
      store: this.name,
      storeSlug: this.slug,
      storeEmoji: this.emoji,
      title: String(raw.title || '').trim(),
      price,
      originalPrice,
      discount,
      currency: raw.currency || 'INR',
      productUrl: raw.productUrl || '#',
      imageUrl: raw.imageUrl || '',
      availability: raw.availability || 'In Stock',
      delivery: raw.delivery || 'Standard Delivery',
      rating: Number(raw.rating) || 4.5,
      reviewCount: Number(raw.reviewCount) || 0,
      bankOffer: raw.bankOffer || null,
      couponCode: raw.couponCode || null,
      fetchedAt: raw.fetchedAt || new Date().toISOString(),
      isDevelopmentProvider: Boolean(this.isDevelopmentProvider)
    };
  }
}

export default BaseStoreAdapter;
