import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class RelianceAdapter extends StoreAdapter {
  constructor() {
    super('reliance', 'Reliance Digital', '🔴', '#E4252A');
  }

  isConfigured() {
    return Boolean(process.env.RELIANCE_API_KEY);
  }

  async searchProducts(query) {
    if (!this.isConfigured()) {
      return [this.getFallbackProduct(query)];
    }
    return [];
  }

  async getProductByUrl(url) {
    const match = url.match(/\/p\/(\d+)/i);
    const pid = match ? match[1] : 'RD_SEARCH';
    return this.getProductById(pid);
  }

  async getProductById(id) {
    if (!this.isConfigured()) {
      return this.getFallbackProduct(id);
    }
    return null;
  }

  getFallbackProduct(identifier) {
    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: identifier || 'RD_DEMO',
      title: `Reliance Digital Listing (${identifier})`,
      brand: 'Reliance',
      price: 69490,
      mrp: 79900,
      availability: true,
      url: `https://www.reliancedigital.in/p/${identifier}`,
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
