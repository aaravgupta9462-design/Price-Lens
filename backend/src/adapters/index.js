import { AmazonAdapter } from './AmazonAdapter.js';
import { FlipkartAdapter } from './FlipkartAdapter.js';
import { CromaAdapter } from './CromaAdapter.js';
import { RelianceDigitalAdapter } from './RelianceDigitalAdapter.js';

class StoreAdapterRegistry {
  constructor() {
    this.adapters = new Map();

    // Register built-in store adapters
    this.register(new AmazonAdapter());
    this.register(new FlipkartAdapter());
    this.register(new CromaAdapter());
    this.register(new RelianceDigitalAdapter());
  }

  /**
   * Register a new store adapter
   * @param {BaseStoreAdapter} adapter
   */
  register(adapter) {
    if (!adapter.slug) {
      throw new Error('Adapter must have a unique slug.');
    }
    this.adapters.set(adapter.slug, adapter);
  }

  /**
   * Get an adapter by slug
   * @param {string} slug
   * @returns {BaseStoreAdapter|undefined}
   */
  get(slug) {
    return this.adapters.get(slug);
  }

  /**
   * Get all registered store adapters
   * @returns {Array<BaseStoreAdapter>}
   */
  getAll() {
    return Array.from(this.adapters.values());
  }

  /**
   * Return metadata about registered stores
   */
  getStoreMetadata() {
    return Array.from(this.adapters.values()).map((a) => ({
      name: a.name,
      slug: a.slug,
      emoji: a.emoji,
      isDevelopmentProvider: a.isDevelopmentProvider
    }));
  }
}

export const adapterRegistry = new StoreAdapterRegistry();
export default adapterRegistry;
