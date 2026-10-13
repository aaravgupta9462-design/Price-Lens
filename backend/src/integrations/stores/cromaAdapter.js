import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class CromaAdapter extends StoreAdapter {
  constructor() {
    super('croma', 'Croma', '🟢', '#00E9BF');
  }

  isConfigured() {
    return Boolean(process.env.CROMA_API_KEY);
  }

  async searchProducts(query) {
    if (!this.isConfigured()) {
      return [this.getFallbackProduct(query)];
    }
    return [];
  }

  async getProductByUrl(url) {
    const match = url.match(/\/p\/(\d+)/i);
    const pid = match ? match[1] : 'CROMA_SEARCH';
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
      productId: identifier || 'CROMA_DEMO',
      title: `Croma Electronics (${identifier})`,
      brand: 'Croma',
      price: 69990,
      mrp: 79900,
      availability: true,
      url: `https://www.croma.com/p/${identifier}`,
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
