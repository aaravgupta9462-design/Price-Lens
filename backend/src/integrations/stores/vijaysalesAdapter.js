import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class VijaySalesAdapter extends StoreAdapter {
  constructor() {
    super('vijaysales', 'Vijay Sales', '⚡', '#D32F2F');
  }

  isConfigured() {
    return Boolean(process.env.VIJAYSALES_API_KEY);
  }

  async searchProducts(query) {
    return [this.getFallbackProduct(query)];
  }

  async getProductByUrl(url) {
    const match = url.match(/\/product\/(\d+)/i);
    const pid = match ? match[1] : 'VS_SEARCH';
    return this.getProductById(pid);
  }

  async getProductById(id) {
    return this.getFallbackProduct(id);
  }

  getFallbackProduct(identifier) {
    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: identifier || 'VS_DEMO',
      title: `Vijay Sales Electronics (${identifier})`,
      brand: 'Vijay Sales',
      price: 68990,
      mrp: 79900,
      availability: true,
      url: `https://www.vijaysales.com/product/${identifier}`,
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
