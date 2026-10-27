import { BaseStoreAdapter } from './BaseStoreAdapter.js';

// Mapping of merchant brand names to UI emojis and slugs
const MERCHANT_META_MAP = {
  amazon: { name: 'Amazon.in', slug: 'amazon', emoji: '📦' },
  flipkart: { name: 'Flipkart', slug: 'flipkart', emoji: '⚡' },
  croma: { name: 'Croma', slug: 'croma', emoji: '🔴' },
  'reliance digital': { name: 'Reliance Digital', slug: 'reliance-digital', emoji: '🔵' },
  'tata cliq': { name: 'Tata CLiQ', slug: 'tatacliq', emoji: '🛍️' },
  samsung: { name: 'Samsung India', slug: 'samsung', emoji: '📱' },
  apple: { name: 'Apple India', slug: 'apple', emoji: '🍎' },
  boat: { name: 'boAt Lifestyle', slug: 'boat', emoji: '🎧' },
  'vijay sales': { name: 'Vijay Sales', slug: 'vijay-sales', emoji: '🛒' },
  myntra: { name: 'Myntra', slug: 'myntra', emoji: '👗' },
  nykaa: { name: 'Nykaa', slug: 'nykaa', emoji: '💄' },
  meesho: { name: 'Meesho', slug: 'meesho', emoji: '🏷️' },
  snapdeal: { name: 'Snapdeal', slug: 'snapdeal', emoji: '📦' },
  firstcry: { name: 'FirstCry', slug: 'firstcry', emoji: '👶' },
  lenskart: { name: 'Lenskart', slug: 'lenskart', emoji: '👓' },
  pepperfry: { name: 'Pepperfry', slug: 'pepperfry', emoji: '🛋️' },
  decathlon: { name: 'Decathlon India', slug: 'decathlon', emoji: '⚽' },
  mi: { name: 'Xiaomi India', slug: 'mi', emoji: '📱' },
  oneplus: { name: 'OnePlus India', slug: 'oneplus', emoji: '🔴' }
};

/**
 * SerpApiGoogleShoppingAdapter
 * 
 * Fetches real-time multi-store offers across all Indian e-commerce merchants
 * using SerpApi's Google Shopping engine with localized parameters (gl=in, google_domain=google.co.in).
 */
export class SerpApiShoppingAdapter extends BaseStoreAdapter {
  constructor() {
    const apiKey = process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY;
    const isLive = Boolean(apiKey && apiKey.trim().length > 5);

    super('Google Shopping (Multi-Store)', 'serpapi', {
      emoji: '🌐',
      isDevelopmentProvider: !isLive
    });

    this.apiKey = apiKey || '';
    this.timeoutMs = parseInt(process.env.SERPAPI_TIMEOUT_MS || '7000', 10);
  }

  /**
   * Helper to resolve merchant metadata from raw source string
   */
  resolveMerchant(sourceName) {
    if (!sourceName) {
      return { name: 'Online Merchant', slug: 'online-merchant', emoji: '🏬' };
    }

    const cleanSource = String(sourceName).trim();
    const lower = cleanSource.toLowerCase();

    for (const [key, meta] of Object.entries(MERCHANT_META_MAP)) {
      if (lower.includes(key)) {
        return meta;
      }
    }

    const slug = cleanSource
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      name: cleanSource,
      slug: slug || 'store',
      emoji: '🏬'
    };
  }

  /**
   * Parse numeric price safely from string or number
   */
  parsePrice(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Search Google Shopping in India via SerpApi
   * @param {string} query
   * @returns {Promise<Array<NormalizedOffer>>}
   */
  async search(query) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) return [];

    // Fallback if no API key is configured yet
    if (!this.apiKey || this.isDevelopmentProvider) {
      return this.getDevelopmentOffers(cleanQuery);
    }

    try {
      const url = new URL('https://serpapi.com/search.json');
      url.searchParams.set('engine', 'google_shopping');
      url.searchParams.set('q', cleanQuery);
      url.searchParams.set('google_domain', 'google.co.in');
      url.searchParams.set('gl', 'in');
      url.searchParams.set('hl', 'en');
      url.searchParams.set('api_key', this.apiKey);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json'
        }
      });

      clearTimeout(timer);

      if (!response.ok) {
        const rawError = await response.text().catch(() => '');
        const sanitized = this.apiKey ? rawError.split(this.apiKey).join('[KEY_REDACTED]') : rawError;
        console.warn(`[SerpApiAdapter] HTTP ${response.status} from SerpApi: ${sanitized}`);
        return this.getDevelopmentOffers(cleanQuery);
      }

      const data = await response.json();
      const results = Array.isArray(data.shopping_results) ? data.shopping_results : [];

      if (results.length === 0) {
        return [];
      }

      return results.map((item) => {
        const merchant = this.resolveMerchant(item.source);
        const price = Math.round(Number(item.extracted_price) || this.parsePrice(item.price));
        const originalPrice = Math.round(
          Number(item.extracted_old_price) || this.parsePrice(item.old_price) || price
        );

        const link = item.link || item.product_link || '#';
        const thumbnail = item.thumbnail || '';
        const inStock = !String(item.snippet || '').toLowerCase().includes('out of stock');

        return this.normalizeOffer({
          store: merchant.name,
          storeSlug: merchant.slug,
          storeEmoji: merchant.emoji,
          title: item.title || cleanQuery,
          price,
          originalPrice,
          currency: 'INR',
          url: link,
          productUrl: link,
          image: thumbnail,
          imageUrl: thumbnail,
          inStock,
          availability: inStock ? 'In Stock' : 'Out of Stock',
          delivery: item.delivery || 'Standard Delivery',
          rating: Number(item.rating) || 4.3,
          reviewCount: Number(item.reviews) || 0,
          bankOffer: 'Instant discount available at checkout',
          fetchedAt: new Date().toISOString(),
          isDevelopmentProvider: false
        });
      });
    } catch (err) {
      console.warn(`[SerpApiAdapter] Live query failed for "${cleanQuery}":`, err.message);
      // Fallback on timeout or network error to avoid failing the search
      return this.getDevelopmentOffers(cleanQuery);
    }
  }

  /**
   * Transparent dev provider when SERPAPI_API_KEY is not set
   */
  getDevelopmentOffers(query) {
    const q = query.toLowerCase();
    const now = new Date().toISOString();

    const devCatalog = [
      {
        matchKeys: ['iphone 16', 'iphone', 'apple'],
        title: 'Apple iPhone 16 128GB - Teal',
        basePrice: 74900,
        imageUrl: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg'
      },
      {
        matchKeys: ['macbook', 'macbook air', 'macbook m3'],
        title: 'Apple MacBook Air M3 (13-inch, 8GB RAM, 256GB SSD) - Space Grey',
        basePrice: 104900,
        imageUrl: 'https://m.media-amazon.com/images/I/71ItMeqzpDL._SX679_.jpg'
      },
      {
        matchKeys: ['samsung', 'galaxy s25', 's25'],
        title: 'Samsung Galaxy S25 5G (Sparkling Blue, 256GB)',
        basePrice: 79999,
        imageUrl: 'https://m.media-amazon.com/images/I/71xL8-5XhQL._SX679_.jpg'
      },
      {
        matchKeys: ['sony', 'xm5', 'wh-1000xm5', 'headphones'],
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
        basePrice: 28990,
        imageUrl: 'https://m.media-amazon.com/images/I/61+btxzpfDL._SX679_.jpg'
      }
    ];

    const match = this.findBestCatalogMatch(q, devCatalog);
    if (!match) return [];

    const simulatedStores = [
      { name: 'Amazon.in', slug: 'amazon', emoji: '📦', delta: -1000, origDelta: 5000 },
      { name: 'Flipkart', slug: 'flipkart', emoji: '⚡', delta: 500, origDelta: 4000 },
      { name: 'Croma', slug: 'croma', emoji: '🔴', delta: 0, origDelta: 4500 },
      { name: 'Reliance Digital', slug: 'reliance-digital', emoji: '🔵', delta: 990, origDelta: 3000 },
      { name: 'Tata CLiQ', slug: 'tatacliq', emoji: '🛍️', delta: 1200, origDelta: 3500 },
      { name: 'Vijay Sales', slug: 'vijay-sales', emoji: '🛒', delta: 200, origDelta: 4200 }
    ];

    return simulatedStores.map((store) => {
      const price = Math.round(match.basePrice + store.delta);
      const originalPrice = Math.round(match.basePrice + store.origDelta);

      return this.normalizeOffer({
        store: store.name,
        storeSlug: store.slug,
        storeEmoji: store.emoji,
        title: match.title,
        price,
        originalPrice,
        currency: 'INR',
        url: `https://www.${store.slug}.com/search?q=${encodeURIComponent(query)}`,
        productUrl: `https://www.${store.slug}.com/search?q=${encodeURIComponent(query)}`,
        image: match.imageUrl,
        imageUrl: match.imageUrl,
        inStock: true,
        availability: 'In Stock',
        delivery: '2-3 Business Days',
        rating: 4.5,
        reviewCount: 320,
        bankOffer: '₹2,000 off on select bank cards',
        fetchedAt: now,
        isDevelopmentProvider: true
      });
    });
  }

  async getProductOffer(productId) {
    const offers = await this.search(productId);
    return offers.length > 0 ? offers[0] : null;
  }
}

export default SerpApiShoppingAdapter;
