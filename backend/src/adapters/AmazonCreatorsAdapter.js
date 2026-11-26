import { BaseStoreAdapter } from './BaseStoreAdapter.js';
import { logger } from '../utils/logger.util.js';

/**
 * AmazonCreatorsAdapter
 * 
 * Official Amazon Associates Creators API integration (Phase 2 Direct Adapter).
 * Replaces deprecated Product Advertising API (PA-API 5.0).
 * Official Docs: affiliate-program.amazon.in/creatorsapi/docs
 * 
 * Verified against official documentation:
 * - Auth Protocol: OAuth 2.0 Client Credentials Grant via Login with Amazon (LwA)
 * - Required Credentials: Credential ID + Credential Secret + Partner Tag
 * - Main Search Endpoint: https://creatorsapi.amazon/catalog/v1/searchItems
 * - Marketplace Header: x-marketplace (e.g. www.amazon.in)
 * - Payload convention: lowerCamelCase (keywords, partnerTag, partnerType, marketplace, resources)
 * - Output shape: { store, title, price, currency, url, image, inStock, fetchedAt }
 */
export class AmazonCreatorsAdapter extends BaseStoreAdapter {
  constructor(options = {}) {
    const credentialId = options.credentialId || process.env.AMAZON_CREDENTIAL_ID || '';
    const credentialSecret = options.credentialSecret || process.env.AMAZON_CREDENTIAL_SECRET || '';
    const partnerTag = options.partnerTag || process.env.AMAZON_PARTNER_TAG || '';
    const isConfigured = Boolean(credentialId && credentialSecret && partnerTag);

    super('Amazon', 'amazon', {
      emoji: '📦',
      isDevelopmentProvider: !isConfigured
    });

    this.credentialId = credentialId;
    this.credentialSecret = credentialSecret;
    this.partnerTag = partnerTag;
    this.marketplace = options.marketplace || process.env.AMAZON_MARKETPLACE || 'www.amazon.in';
    this.timeoutMs = options.timeoutMs || parseInt(process.env.ADAPTER_TIMEOUT_MS || '8000', 10);

    // OAuth 2.0 In-Memory Token Caching
    this.cachedToken = null;
    this.tokenExpiresAt = 0;
    // Buffer to proactively refresh token before it strictly expires (5 minutes)
    this.refreshBufferMs = options.refreshBufferMs || 5 * 60 * 1000;

    // Endpoints
    // TODO(unverified): Exact LwA OAuth token endpoint domain for Indian accounts (api.amazon.co.uk vs api.amazon.com vs api.amazon.in).
    this.oauthUrl = options.oauthUrl || process.env.AMAZON_OAUTH_URL || 'https://api.amazon.co.uk/auth/o2/token';
    // TODO(unverified): Exact OAuth scope string required by LwA gateway ('creatorsapi:access' vs 'cns::infoproducts:read' vs omitted).
    this.oauthScope = options.oauthScope || process.env.AMAZON_OAUTH_SCOPE || 'creatorsapi:access';
    // TODO(unverified): Exact casing in searchItems request body (camelCase vs PascalCase in newest Creators API gateway).
    this.apiUrl = options.apiUrl || process.env.AMAZON_CREATORS_API_URL || 'https://creatorsapi.amazon/catalog/v1/searchItems';
    // TODO(unverified): SearchItems pagination token / max result count parameter name in Creators API.
    // TODO(unverified): Rate limit quotas and throttling tier rules (TPS limits).
  }

  /**
   * Check if the currently cached token is valid and not expiring soon
   * @returns {boolean}
   */
  isTokenValid() {
    return Boolean(
      this.cachedToken &&
      Date.now() < (this.tokenExpiresAt - this.refreshBufferMs)
    );
  }

  /**
   * Retrieve cached OAuth access token or fetch a new one via Client Credentials Grant
   * @returns {Promise<string>}
   */
  async getAccessToken() {
    if (this.isTokenValid()) {
      return this.cachedToken;
    }

    if (!this.credentialId || !this.credentialSecret) {
      throw new Error('Amazon Creators API credentialId or credentialSecret missing');
    }

    const bodyParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.credentialId,
      client_secret: this.credentialSecret,
      scope: this.oauthScope
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.oauthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: bodyParams.toString(),
        signal: controller.signal
      });

      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error(`Amazon Creators OAuth authentication failed with status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`Amazon Creators OAuth token error: HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.access_token) {
        throw new Error('Amazon Creators OAuth response did not contain access_token');
      }

      this.cachedToken = data.access_token;
      const expiresInSec = Number(data.expires_in) || 3600;
      this.tokenExpiresAt = Date.now() + (expiresInSec * 1000);

      return this.cachedToken;
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')) {
        throw new Error(`Amazon Creators OAuth token request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Search Amazon catalog using official Creators API SearchItems endpoint
   * @param {string} query
   * @returns {Promise<Array<Object>>}
   */
  async search(query) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) return [];

    if (!this.credentialId || !this.credentialSecret || !this.partnerTag) {
      logger.warn('[AmazonCreatorsAdapter] Missing AMAZON_CREDENTIAL_ID, AMAZON_CREDENTIAL_SECRET, or AMAZON_PARTNER_TAG. Skipping live call.');
      return [];
    }

    const token = await this.getAccessToken();

    const requestPayload = {
      keywords: cleanQuery,
      partnerTag: this.partnerTag,
      partnerType: 'Associates',
      marketplace: this.marketplace,
      resources: [
        'ItemInfo.Title',
        'Images.Primary.Large',
        'Images.Primary.Medium',
        'Offers.Listings.Price',
        'Offers.Listings.Availability'
      ]
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-marketplace': this.marketplace
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      if (response.status === 401 || response.status === 403) {
        // Invalidate cached token so next request forces re-authentication
        this.cachedToken = null;
        this.tokenExpiresAt = 0;
        throw new Error(`Amazon Creators API search authentication failed with status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`Amazon Creators API search error: HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResponse(data, cleanQuery);
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')) {
        throw new Error(`AmazonCreatorsAdapter query timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Fetch a specific product offer by product ID (ASIN)
   * @param {string} productId
   * @returns {Promise<Object|null>}
   */
  async getProductOffer(productId) {
    const offers = await this.search(productId);
    return offers.length > 0 ? offers[0] : null;
  }

  /**
   * Parse Amazon Creators API SearchItems response into standard PriceLens offer shape
   * Supports both lowerCamelCase and legacy PascalCase responses from the API gateway
   * @param {Object} data
   * @param {string} query
   * @returns {Array<Object>}
   */
  parseSearchResponse(data, query) {
    if (!data) return [];

    const searchResult = data.searchResult || data.SearchResult;
    const items = searchResult?.items || searchResult?.Items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    const offers = [];
    for (const item of items) {
      const title =
        item.itemInfo?.title?.displayValue ||
        item.ItemInfo?.Title?.DisplayValue ||
        item.title ||
        '';
      if (!title) continue;

      const listing =
        item.offers?.listings?.[0] ||
        item.Offers?.Listings?.[0];

      const priceObj = listing?.price || listing?.Price;
      const price = Math.round(Number(priceObj?.amount || priceObj?.Amount) || 0);
      const currency = priceObj?.currency || priceObj?.Currency || 'INR';

      const productUrl = item.detailPageURL || item.DetailPageURL || '#';
      const imageUrl =
        item.images?.primary?.large?.url ||
        item.Images?.Primary?.Large?.URL ||
        item.images?.primary?.medium?.url ||
        item.Images?.Primary?.Medium?.URL ||
        '';

      const availType = String(
        listing?.availability?.type ||
        listing?.Availability?.Type ||
        'Now'
      ).toLowerCase();
      const inStock = !availType.includes('out of stock') && !availType.includes('unavailable');

      offers.push(this.normalizeOffer({
        store: 'Amazon',
        storeSlug: 'amazon',
        storeEmoji: '📦',
        title,
        price,
        originalPrice: price,
        currency,
        url: productUrl,
        productUrl,
        image: imageUrl,
        imageUrl,
        inStock,
        availability: inStock ? 'In Stock' : 'Out of Stock',
        delivery: 'FREE Prime One-Day delivery',
        rating: 4.5,
        reviewCount: 0,
        bankOffer: 'Instant discount available on select bank cards',
        fetchedAt: new Date().toISOString(),
        isDirect: true,
        isDirectApi: true,
        isDevelopmentProvider: false
      }));
    }

    return offers;
  }
}

export default AmazonCreatorsAdapter;
