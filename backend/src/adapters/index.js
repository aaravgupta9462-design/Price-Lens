import { AmazonCreatorsAdapter } from './AmazonCreatorsAdapter.js';
import { FlipkartAffiliateAdapter } from './FlipkartAffiliateAdapter.js';
import { CromaAdapter } from './CromaAdapter.js';
import { RelianceDigitalAdapter } from './RelianceDigitalAdapter.js';
import { SerpApiShoppingAdapter } from './SerpApiShoppingAdapter.js';
import { logger } from '../utils/logger.util.js';

// Retain legacy adapter exports for backwards compatibility
export { AmazonAdapter } from './AmazonAdapter.js';
export { FlipkartAdapter } from './FlipkartAdapter.js';
export { AmazonCreatorsAdapter } from './AmazonCreatorsAdapter.js';
export { FlipkartAffiliateAdapter } from './FlipkartAffiliateAdapter.js';

export class StoreAdapterRegistry {
  constructor() {
    this.adapters = new Map();
    this.enabledFlags = new Map();

    // Register SerpApi Google Shopping adapter (Phase 1 aggregator, enabled by default)
    const enableSerpApi = process.env.ENABLE_SERPAPI !== 'false';
    this.register(new SerpApiShoppingAdapter(), enableSerpApi);

    // Phase 2 Direct Adapters: Disabled by default (default false)
    const enableAmazon = process.env.ENABLE_AMAZON === 'true';
    const enableFlipkart = process.env.ENABLE_FLIPKART === 'true';

    // Store aggregators & retailer adapters
    const enableCroma = process.env.ENABLE_CROMA !== 'false';
    const enableReliance = process.env.ENABLE_RELIANCE_DIGITAL !== 'false';

    // 1. Amazon Creators API Adapter
    const amazonAdapter = new AmazonCreatorsAdapter();
    let amazonEnabled = false;
    if (enableAmazon) {
      const hasAmazonKeys = Boolean(
        process.env.AMAZON_CREDENTIAL_ID &&
        process.env.AMAZON_CREDENTIAL_SECRET &&
        process.env.AMAZON_PARTNER_TAG
      );
      if (hasAmazonKeys) {
        amazonEnabled = true;
      } else {
        logger.warn(
          '[StoreAdapterRegistry] ENABLE_AMAZON is true but AMAZON_CREDENTIAL_ID, AMAZON_CREDENTIAL_SECRET, or AMAZON_PARTNER_TAG is missing. Skipping Amazon adapter.'
        );
      }
    }
    this.register(amazonAdapter, amazonEnabled);

    // 2. Flipkart Affiliate Adapter
    const flipkartAdapter = new FlipkartAffiliateAdapter();
    let flipkartEnabled = false;
    if (enableFlipkart) {
      const hasFlipkartKeys = Boolean(
        process.env.FLIPKART_AFFILIATE_ID &&
        process.env.FLIPKART_AFFILIATE_TOKEN
      );
      if (hasFlipkartKeys) {
        flipkartEnabled = true;
      } else {
        logger.warn(
          '[StoreAdapterRegistry] ENABLE_FLIPKART is true but FLIPKART_AFFILIATE_ID or FLIPKART_AFFILIATE_TOKEN is missing. Skipping Flipkart adapter.'
        );
      }
    }
    this.register(flipkartAdapter, flipkartEnabled);

    // 3. Croma & Reliance Digital adapters
    this.register(new CromaAdapter(), enableCroma);
    this.register(new RelianceDigitalAdapter(), enableReliance);
  }

  /**
   * Register a new store adapter
   * @param {BaseStoreAdapter} adapter
   * @param {boolean} [isEnabled=true]
   */
  register(adapter, isEnabled = true) {
    if (!adapter.slug) {
      throw new Error('Adapter must have a unique slug.');
    }
    this.adapters.set(adapter.slug, adapter);
    this.enabledFlags.set(adapter.slug, Boolean(isEnabled));
  }

  /**
   * Enable a specific adapter by slug
   * @param {string} slug
   */
  enable(slug) {
    if (this.adapters.has(slug)) {
      this.enabledFlags.set(slug, true);
    }
  }

  /**
   * Disable a specific adapter by slug
   * @param {string} slug
   */
  disable(slug) {
    if (this.adapters.has(slug)) {
      this.enabledFlags.set(slug, false);
    }
  }

  /**
   * Check if an adapter is currently enabled
   * @param {string} slug
   * @returns {boolean}
   */
  isEnabled(slug) {
    return Boolean(this.enabledFlags.get(slug));
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
   * Get all currently ENABLED store adapters
   * @returns {Array<BaseStoreAdapter>}
   */
  getAll() {
    const enabled = [];
    for (const [slug, adapter] of this.adapters.entries()) {
      if (this.enabledFlags.get(slug)) {
        enabled.push(adapter);
      }
    }
    return enabled;
  }

  /**
   * Get all registered store adapters (both enabled and disabled)
   * @returns {Array<BaseStoreAdapter>}
   */
  getAllRegistered() {
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
      isEnabled: Boolean(this.enabledFlags.get(a.slug)),
      isDevelopmentProvider: Boolean(a.isDevelopmentProvider)
    }));
  }
}

export const adapterRegistry = new StoreAdapterRegistry();
export default adapterRegistry;
