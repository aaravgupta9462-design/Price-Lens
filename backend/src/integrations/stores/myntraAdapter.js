import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class MyntraAdapter extends StoreAdapter {
  constructor() {
    super('myntra', 'Myntra', '🛍️', '#FF3F6C');
  }

  isConfigured() {
    return Boolean(process.env.MYNTRA_API_KEY);
  }

  async searchProducts(query) {
    if (!this.isConfigured()) {
      return [this.getFallbackProduct(query)];
    }
    return [];
  }

  async getProductByUrl(url) {
    const match = url.match(/\/(\d+)\/buy/i);
    const pid = match ? match[1] : 'MYNTRA_SEARCH';
    return this.getProductById(pid);
  }

  async getProductById(id) {
    return this.getFallbackProduct(id);
  }

  getFallbackProduct(identifier) {
    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: identifier || 'MYN_DEMO',
      title: `Myntra Fashion (${identifier})`,
      brand: 'Myntra',
      price: 2499,
      mrp: 3999,
      availability: true,
      url: `https://www.myntra.com/${identifier}`,
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
