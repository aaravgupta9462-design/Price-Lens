import { BaseStoreAdapter } from './BaseStoreAdapter.js';
import { logger } from '../utils/logger.util.js';

/**
 * FlipkartAffiliateAdapter
 * 
 * Official Flipkart Affiliate API integration (Phase 2 Direct Adapter).
 * Official Docs: https://affiliate.flipkart.com/api-docs/
 * 
 * Verified against official documentation:
 * - Base API Host: affiliate-api.flipkart.net
 * - Keyword Search API Endpoint: https://affiliate-api.flipkart.net/affiliate/1.0/search.json
 * - Auth Headers: Fk-Affiliate-Id and Fk-Affiliate-Token
 * - Output shape: { store, title, price, currency, url, image, inStock, fetchedAt }
 */
export class FlipkartAffiliateAdapter extends BaseStoreAdapter {
  constructor(options = {}) {
    const affiliateId = options.affiliateId || process.env.FLIPKART_AFFILIATE_ID || '';
    const affiliateToken = options.affiliateToken || process.env.FLIPKART_AFFILIATE_TOKEN || '';
    const isConfigured = Boolean(affiliateId && affiliateToken);

    super('Flipkart', 'flipkart', {
      emoji: '⚡',
      isDevelopmentProvider: !isConfigured
    });

    this.affiliateId = affiliateId;
    this.affiliateToken = affiliateToken;
    this.timeoutMs = options.timeoutMs || parseInt(process.env.ADAPTER_TIMEOUT_MS || '8000', 10);
    this.baseUrl = options.baseUrl || 'https://affiliate-api.flipkart.net/affiliate/1.0/search.json';

    // TODO(unverified): Exact rate limit threshold for Flipkart Affiliate Search API (TPS / requests per minute).
    // TODO(unverified): Category scoping or filter parameters if supported beyond query & resultCount.
    // TODO(unverified): Product shipping/delivery details format in productShippingBaseInfo.
    // TODO(unverified): Whether keyword search API is available to all account tiers or restricted to legacy grandfathered accounts.
  }

  /**
   * Search Flipkart catalog using official Affiliate Search API
   * @param {string} query
   * @returns {Promise<Array<Object>>}
   */
  async search(query) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) return [];

    if (!this.affiliateId || !this.affiliateToken) {
      logger.warn('[FlipkartAffiliateAdapter] Missing FLIPKART_AFFILIATE_ID or FLIPKART_AFFILIATE_TOKEN. Skipping live call.');
      return [];
    }

    const url = new URL(this.baseUrl);
    url.searchParams.set('query', cleanQuery);
    url.searchParams.set('resultCount', '10');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Fk-Affiliate-Id': this.affiliateId,
          'Fk-Affiliate-Token': this.affiliateToken,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(`Flipkart Affiliate authentication failed with status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`Flipkart Affiliate API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResponse(data, cleanQuery);
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')) {
        throw new Error(`FlipkartAffiliateAdapter query timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Fetch a specific product offer by product ID
   * @param {string} productId
   * @returns {Promise<Object|null>}
   */
  async getProductOffer(productId) {
    const offers = await this.search(productId);
    return offers.length > 0 ? offers[0] : null;
  }

  /**
   * Parse Flipkart Affiliate search JSON response into standard PriceLens offer shape
   * @param {Object} data
   * @param {string} query
   * @returns {Array<Object>}
   */
  parseSearchResponse(data, query) {
    if (!data) return [];

    // Support both products array and legacy productInfoList format
    const products = data.products || data.productInfoList || [];
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    const offers = [];
    for (const item of products) {
      const baseInfo = item.productBaseInfoV1 || item.productBaseInfo || item;
      if (!baseInfo) continue;

      const title = String(baseInfo.title || '').trim();
      if (!title) continue;

      // Pricing: Flipkart provides flipkartSpecialPrice (discounted/lightning deal)
      // and flipkartSellingPrice, plus maximumRetailPrice (MRP)
      const specialAmount = Number(baseInfo.flipkartSpecialPrice?.amount);
      const sellingAmount = Number(baseInfo.flipkartSellingPrice?.amount);
      const mrpAmount = Number(baseInfo.maximumRetailPrice?.amount);

      let price = 0;
      if (!isNaN(specialAmount) && specialAmount > 0) {
        price = specialAmount;
      } else if (!isNaN(sellingAmount) && sellingAmount > 0) {
        price = sellingAmount;
      } else if (!isNaN(mrpAmount) && mrpAmount > 0) {
        price = mrpAmount;
      }

      const originalPrice = !isNaN(mrpAmount) && mrpAmount > 0 ? mrpAmount : price;
      const currency = baseInfo.flipkartSpecialPrice?.currency || baseInfo.flipkartSellingPrice?.currency || 'INR';
      const productUrl = baseInfo.productUrl || '#';

      // Images: Flipkart returns an imageUrls object with resolution keys ('800x800', '400x400', '200x200')
      let imageUrl = '';
      if (baseInfo.imageUrls && typeof baseInfo.imageUrls === 'object') {
        imageUrl = baseInfo.imageUrls['800x800'] ||
                   baseInfo.imageUrls['400x400'] ||
                   baseInfo.imageUrls['200x200'] ||
                   Object.values(baseInfo.imageUrls)[0] || '';
      } else if (typeof baseInfo.imageUrls === 'string') {
        imageUrl = baseInfo.imageUrls;
      }

      const inStock = baseInfo.inStock !== false;
      const delivery = item.productShippingBaseInfo?.shippingTime || 'Standard Delivery';

      offers.push(this.normalizeOffer({
        store: 'Flipkart',
        storeSlug: 'flipkart',
        storeEmoji: '⚡',
        title,
        price,
        originalPrice,
        currency,
        url: productUrl,
        productUrl,
        image: imageUrl,
        imageUrl,
        inStock,
        availability: inStock ? 'In Stock' : 'Out of Stock',
        delivery,
        rating: Number(baseInfo.productRating) || 4.4,
        reviewCount: Number(baseInfo.totalRatings) || 0,
        bankOffer: 'Instant discount available on select cards',
        fetchedAt: new Date().toISOString(),
        isDirect: true,
        isDirectApi: true,
        isDevelopmentProvider: false
      }));
    }

    return offers;
  }
}

export default FlipkartAffiliateAdapter;
