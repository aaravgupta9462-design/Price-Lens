import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';
import { generateAffiliateUrl } from '../../common/affiliateGenerator.js';

export class AmazonAdapter extends StoreAdapter {
  constructor() {
    super('amazon', 'Amazon India', '📦', '#FF9900');
  }

  getStatus() {
    return 'PENDING_APPROVAL'; // Amazon Creators API requires prior approval for price aggregation
  }

  isConfigured() {
    return Boolean(process.env.AMAZON_CLIENT_ID && process.env.AMAZON_CLIENT_SECRET && this.getStatus() === 'CONNECTED');
  }

  async searchProducts(query) {
    if (!this.isConfigured()) {
      return this.getFallbackProduct(query);
    }
    // Real Amazon PA-API call integration
    // Returns normalized product
    return [];
  }

  async getProductByUrl(url) {
    const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    const asin = asinMatch ? asinMatch[1] : 'ASIN_SEARCH';
    return this.getProductById(asin);
  }

  async getProductById(id) {
    if (!this.isConfigured()) {
      return this.getFallbackProduct(id);
    }
    // PA-API GetItems call
    return null;
  }

  getFallbackProduct(identifier) {
    // When API credentials are NOT configured, return clean schema marked unconfigured
    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: identifier || 'AMZ_DEMO',
      title: `Amazon Listing (${identifier})`,
      brand: 'Amazon Partner',
      price: 68499,
      mrp: 79900,
      availability: true,
      url: generateAffiliateUrl('amazon', `https://www.amazon.in/dp/${identifier}`),
      affiliateUrl: generateAffiliateUrl('amazon', `https://www.amazon.in/dp/${identifier}`),
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
