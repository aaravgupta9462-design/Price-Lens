/**
 * Abstract Store Adapter Base Class
 * Defines standard contract methods for all e-commerce store integrations.
 */

export class StoreAdapter {
  constructor(storeCode, storeName, emoji, color) {
    this.storeCode = storeCode;
    this.storeName = storeName;
    this.emoji = emoji;
    this.color = color;
  }

  // Check if API keys/credentials are configured in process.env
  isConfigured() {
    return false;
  }

  // Search products by text query
  async searchProducts(query) {
    throw new Error(`Method searchProducts() not implemented for ${this.storeName}`);
  }

  // Fetch product details by store URL
  async getProductByUrl(url) {
    throw new Error(`Method getProductByUrl() not implemented for ${this.storeName}`);
  }

  // Fetch product by internal store ID / SKU
  async getProductById(id) {
    throw new Error(`Method getProductById() not implemented for ${this.storeName}`);
  }

  // Fetch offers for normalized product
  async getOffers(product) {
    throw new Error(`Method getOffers() not implemented for ${this.storeName}`);
  }

  // Check availability
  async getAvailability(product) {
    return true;
  }

  // Normalize raw API payload into standard PriceLens schema
  normalizeProduct(data) {
    throw new Error(`Method normalizeProduct() not implemented for ${this.storeName}`);
  }
}
