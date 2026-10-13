import { StoreAdapter } from '../storeAdapter.js';
import { normalizeProduct } from '../../common/productNormalizer.js';

export class FlipkartAdapter extends StoreAdapter {
  constructor() {
    super('flipkart', 'Flipkart', '🛒', '#2874F0');
    this.baseUrl = 'https://affiliate-api.flipkart.net/affiliate/1.0';
  }

  isConfigured() {
    const affiliateId = process.env.FLIPKART_AFFILIATE_ID;
    const token = process.env.FLIPKART_AFFILIATE_TOKEN;
    return Boolean(affiliateId && token && affiliateId.trim() !== '' && token.trim() !== '');
  }

  getHeaders() {
    return {
      'Fk-Affiliate-Id': process.env.FLIPKART_AFFILIATE_ID,
      'Fk-Affiliate-Token': process.env.FLIPKART_AFFILIATE_TOKEN,
      'Accept': 'application/json'
    };
  }

  async searchProducts(query) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const endpoint = `${this.baseUrl}/search.json?query=${encodeURIComponent(query)}&resultCount=5`;
      const res = await fetch(endpoint, { headers: this.getHeaders() });
      if (!res.ok) {
        throw new Error(`Flipkart Search API responded with status ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const products = data.products || data.productInfoList || [];

      return products.map((item) => this.parseFlipkartProduct(item));
    } catch (err) {
      console.error(`[FlipkartAdapter] searchProducts error:`, err.message);
      throw err;
    }
  }

  async getProductByUrl(url) {
    const match = url.match(/pid=([A-Z0-9]{16})/i) || url.match(/\/p\/([a-z0-9]+)/i);
    const pid = match ? match[1] : null;
    if (!pid) {
      throw new Error('Could not extract Flipkart Product ID (pid) from URL');
    }
    return this.getProductById(pid);
  }

  async getProductById(id) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const endpoint = `${this.baseUrl}/product.json?id=${id}`;
      const res = await fetch(endpoint, { headers: this.getHeaders() });
      if (!res.ok) {
        throw new Error(`Flipkart Product API responded with status ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return this.parseFlipkartProduct(data);
    } catch (err) {
      console.error(`[FlipkartAdapter] getProductById error:`, err.message);
      throw err;
    }
  }

  parseFlipkartProduct(item) {
    const baseInfo = item.productBaseInfoV1 || item.productBaseInfo || item;
    const attrs = baseInfo.productAttributes || {};
    const shipping = baseInfo.shippingOptions || {};

    const title = attrs.title || 'Flipkart Product';
    const sellingPrice = attrs.sellingPrice ? attrs.sellingPrice.amount : (attrs.price || 0);
    const maximumRetailPrice = attrs.maximumRetailPrice ? attrs.maximumRetailPrice.amount : sellingPrice;
    const imageUrl = attrs.imageUrls ? (attrs.imageUrls['400x400'] || attrs.imageUrls['200x200'] || Object.values(attrs.imageUrls)[0]) : null;
    const productUrl = attrs.productUrl || '#';

    return normalizeProduct({
      store: this.storeName,
      storeCode: this.storeCode,
      productId: item.productId || attrs.productId || baseInfo.productId || 'FK_ITEM',
      title,
      brand: attrs.productBrand || '',
      model: attrs.modelNumber || '',
      color: attrs.color || '',
      storage: attrs.storage || '',
      image: imageUrl || '🛒',
      price: sellingPrice,
      mrp: maximumRetailPrice,
      availability: attrs.inStock !== undefined ? attrs.inStock : true,
      stockStatus: attrs.inStock ? 'In Stock' : 'Out of Stock',
      url: productUrl,
      affiliateUrl: productUrl,
      isConfigured: true
    });
  }
}
