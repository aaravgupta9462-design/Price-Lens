import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class TataCliqAdapter extends StoreAdapter {
  constructor() {
    super('tatacliq', 'Tata CLiQ', '💎', '#A21D5A');
  }

  isConfigured() {
    return Boolean(process.env.TATACLIQ_API_KEY);
  }

  async searchProducts(query) {
    return [this.getFallbackProduct(query)];
  }

  async getProductByUrl(url) {
    const match = url.match(/\/p-mp(\d+)/i);
    const pid = match ? match[1] : 'TC_SEARCH';
    return this.getProductById(pid);
  }

  async getProductById(id) {
    return this.getFallbackProduct(id);
  }

  getFallbackProduct(identifier) {
    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: identifier || 'TC_DEMO',
      title: `Tata CLiQ Item (${identifier})`,
      brand: 'Tata CLiQ',
      price: 69999,
      mrp: 79900,
      availability: true,
      url: `https://www.tatacliq.com/p-mp${identifier}`,
      isConfigured: false
    });
  }

  normalizeProduct(data) {
    return normalizeProduct({ ...data, store: this.storeName, storeCode: this.storeCode });
  }
}
