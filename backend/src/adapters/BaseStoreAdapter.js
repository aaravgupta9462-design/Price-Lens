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
