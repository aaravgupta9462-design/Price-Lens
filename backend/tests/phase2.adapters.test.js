import test from 'node:test';
import assert from 'node:assert/strict';
import { FlipkartAffiliateAdapter } from '../src/adapters/FlipkartAffiliateAdapter.js';
import { AmazonCreatorsAdapter } from '../src/adapters/AmazonCreatorsAdapter.js';
import { adapterRegistry, StoreAdapterRegistry } from '../src/adapters/index.js';
import {
  mergeAndDeduplicateOffers,
  areTitlesSimilar,
  isSameStore
} from '../src/utils/offerDeduplicator.js';

// Fixture helpers for mocked fetch
const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test.describe('Phase 2: FlipkartAffiliateAdapter Tests', () => {
  test('FK-1. Success: parses Flipkart Affiliate search API response into standard offer shape', async () => {
    const mockFlipkartResponse = {
      products: [
        {
          productBaseInfoV1: {
            productId: 'MOBGG4876HGFDXS',
            title: 'Apple iPhone 16 (Black, 128 GB)',
            productDescription: 'A18 Bionic Chip, Camera Control, 48MP Fusion Camera',
            imageUrls: {
              '200x200': 'https://rukminim2.flixcart.com/image/200/200/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg',
              '400x400': 'https://rukminim2.flixcart.com/image/400/400/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg',
              '800x800': 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg'
            },
            flipkartSellingPrice: {
              amount: 68999,
              currency: 'INR'
            },
            flipkartSpecialPrice: {
              amount: 67999,
              currency: 'INR'
            },
            maximumRetailPrice: {
              amount: 79999,
              currency: 'INR'
            },
            productUrl: 'https://dl.flipkart.com/dl/apple-iphone-16-black-128-gb/p/itmd...&affid=test_affiliate_id',
            inStock: true,
            productRating: '4.6',
            totalRatings: 18200
          },
          productShippingBaseInfo: {
            shippingTime: 'Delivery in 2 Days · Flipkart Plus'
          }
        }
      ]
    };

    let requestedHeaders = {};
    let requestedUrl = '';

    globalThis.fetch = async (url, options) => {
      requestedUrl = String(url);
      requestedHeaders = options.headers || {};
      return {
        ok: true,
        status: 200,
        json: async () => mockFlipkartResponse
      };
    };

    const adapter = new FlipkartAffiliateAdapter({
      affiliateId: 'mock_fk_id_123',
      affiliateToken: 'mock_fk_token_xyz'
    });

    const results = await adapter.search('iphone 16');

    // 1. Verify Request headers & URL
    assert.ok(requestedUrl.includes('https://affiliate-api.flipkart.net/affiliate/1.0/search.json'));
    assert.ok(requestedUrl.includes('query=iphone+16') || requestedUrl.includes('query=iphone%2016'));
    assert.strictEqual(requestedHeaders['Fk-Affiliate-Id'], 'mock_fk_id_123');
    assert.strictEqual(requestedHeaders['Fk-Affiliate-Token'], 'mock_fk_token_xyz');

    // 2. Verify Output Contract: { store, title, price, currency, url, image, inStock, fetchedAt }
    assert.strictEqual(results.length, 1);
    const offer = results[0];

    assert.strictEqual(offer.store, 'Flipkart');
    assert.strictEqual(offer.title, 'Apple iPhone 16 (Black, 128 GB)');
    assert.strictEqual(offer.price, 67999); // Special price takes priority
    assert.strictEqual(offer.originalPrice, 79999);
    assert.strictEqual(offer.currency, 'INR');
    assert.ok(offer.url.includes('apple-iphone-16'));
    assert.ok(offer.image.includes('rukminim2.flixcart.com'));
    assert.strictEqual(offer.inStock, true);
    assert.ok(typeof offer.fetchedAt === 'string');

    // UI properties
    assert.strictEqual(offer.storeSlug, 'flipkart');
    assert.strictEqual(offer.storeEmoji, '⚡');
    assert.strictEqual(offer.isDirectApi, true);
    assert.strictEqual(offer.isDirect, true);
  });

  test('FK-2. Auth Error: throws descriptive error when Flipkart returns 401 or 403', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized affiliate credentials' })
    });

    const adapter = new FlipkartAffiliateAdapter({
      affiliateId: 'bad_id',
      affiliateToken: 'bad_token'
    });

    await assert.rejects(
      async () => {
        await adapter.search('iphone 16');
      },
      /Flipkart Affiliate authentication failed with status 401/
    );
  });

  test('FK-3. Empty Result: returns empty array when no products match', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ products: [] })
    });

    const adapter = new FlipkartAffiliateAdapter({
      affiliateId: 'valid_id',
      affiliateToken: 'valid_token'
    });

    const results = await adapter.search('nonexistent product query 12345');
    assert.deepStrictEqual(results, []);
  });

  test('FK-4. Timeout: aborts cleanly and throws timeout error', async () => {
    globalThis.fetch = async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      throw abortError;
    };

    const adapter = new FlipkartAffiliateAdapter({
      affiliateId: 'valid_id',
      affiliateToken: 'valid_token',
      timeoutMs: 50
    });

    await assert.rejects(
      async () => {
        await adapter.search('iphone 16');
      },
      /timed out after 50ms/
    );
  });

  test('FK-5. Missing credentials: skips live call and returns empty list', async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return { ok: true, status: 200, json: async () => ({}) };
    };

    const adapter = new FlipkartAffiliateAdapter({
      affiliateId: '',
      affiliateToken: ''
    });

    const results = await adapter.search('iphone 16');
    assert.strictEqual(fetchCalled, false, 'Fetch must not be called when keys are empty');
    assert.deepStrictEqual(results, []);
  });
});

test.describe('Phase 2: AmazonCreatorsAdapter Tests', () => {
  const mockTokenResponse = {
    access_token: 'Atc|mock_oauth_access_token_abc_123',
    token_type: 'bearer',
    expires_in: 3600
  };

  const mockSearchResponse = {
    searchResult: {
      totalResultCount: 1,
      items: [
        {
          asin: 'B0DGJ9M8H4',
          detailPageURL: 'https://www.amazon.in/dp/B0DGJ9M8H4?tag=test-partner-21',
          itemInfo: {
            title: {
              displayValue: 'Apple iPhone 16 (128 GB) - Black',
              label: 'Title'
            }
          },
          images: {
            primary: {
              large: {
                url: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
                width: 679,
                height: 679
              }
            }
          },
          offers: {
            listings: [
              {
                price: {
                  amount: 69999,
                  currency: 'INR'
                },
                availability: {
                  type: 'Now',
                  message: 'In Stock'
                }
              }
            ]
          }
        }
      ]
    }
  };

  test('AMZ-1. Success: fetches OAuth token then searches and normalizes offer shape', async () => {
    let tokenFetched = false;
    let searchCalled = false;
    let authHeaderSent = '';

    globalThis.fetch = async (url, options) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/o2/token')) {
        tokenFetched = true;
        return {
          ok: true,
          status: 200,
          json: async () => mockTokenResponse
        };
      }

      if (urlStr.includes('/catalog/v1/searchItems')) {
        searchCalled = true;
        authHeaderSent = options.headers?.Authorization || '';
        return {
          ok: true,
          status: 200,
          json: async () => mockSearchResponse
        };
      }

      throw new Error(`Unexpected URL called: ${urlStr}`);
    };

    const adapter = new AmazonCreatorsAdapter({
      credentialId: 'mock_cred_id_123',
      credentialSecret: 'mock_cred_secret_xyz',
      partnerTag: 'test-partner-21'
    });

    const results = await adapter.search('iphone 16');

    // 1. Verify OAuth flow + Search call
    assert.strictEqual(tokenFetched, true, 'OAuth token must be requested');
    assert.strictEqual(searchCalled, true, 'SearchItems API must be called');
    assert.strictEqual(authHeaderSent, `Bearer ${mockTokenResponse.access_token}`);

    // 2. Verify Output Contract: { store, title, price, currency, url, image, inStock, fetchedAt }
    assert.strictEqual(results.length, 1);
    const offer = results[0];

    assert.strictEqual(offer.store, 'Amazon');
    assert.strictEqual(offer.title, 'Apple iPhone 16 (128 GB) - Black');
    assert.strictEqual(offer.price, 69999);
    assert.strictEqual(offer.currency, 'INR');
    assert.strictEqual(offer.url, 'https://www.amazon.in/dp/B0DGJ9M8H4?tag=test-partner-21');
    assert.strictEqual(offer.image, 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg');
    assert.strictEqual(offer.inStock, true);
    assert.ok(typeof offer.fetchedAt === 'string');

    // Extended UI metadata
    assert.strictEqual(offer.storeSlug, 'amazon');
    assert.strictEqual(offer.storeEmoji, '📦');
    assert.strictEqual(offer.isDirectApi, true);
  });

  test('AMZ-2. Token Caching & Refresh: reuses token within validity and refreshes when expiring', async () => {
    let tokenRequestCount = 0;

    globalThis.fetch = async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/o2/token')) {
        tokenRequestCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            access_token: `token_v${tokenRequestCount}`,
            expires_in: 3600
          })
        };
      }

      return {
        ok: true,
        status: 200,
        json: async () => mockSearchResponse
      };
    };

    const adapter = new AmazonCreatorsAdapter({
      credentialId: 'mock_cred',
      credentialSecret: 'mock_secret',
      partnerTag: 'partner-21'
    });

    // First search: requests token
    await adapter.search('iphone 16');
    assert.strictEqual(tokenRequestCount, 1);

    // Second search immediately: reuses cached token (NO new token request)
    await adapter.search('iphone 16');
    assert.strictEqual(tokenRequestCount, 1, 'Token must be cached and reused');

    // Simulate expired token: should trigger refresh
    adapter.tokenExpiresAt = Date.now() - 1000;
    await adapter.search('iphone 16');
    assert.strictEqual(tokenRequestCount, 2, 'Token must be refreshed after expiration');
  });

  test('AMZ-3. Auth Error: handles OAuth 401 client credentials failure', async () => {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/auth/o2/token')) {
        return {
          ok: false,
          status: 401,
          json: async () => ({ error: 'invalid_client' })
        };
      }
      return { ok: true, status: 200, json: async () => ({}) };
    };

    const adapter = new AmazonCreatorsAdapter({
      credentialId: 'bad_cred',
      credentialSecret: 'bad_secret',
      partnerTag: 'tag-21'
    });

    await assert.rejects(
      async () => {
        await adapter.search('iphone 16');
      },
      /Amazon Creators OAuth authentication failed with status 401/
    );
  });

  test('AMZ-4. Empty Result: returns empty array when searchResult.items is empty', async () => {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/auth/o2/token')) {
        return { ok: true, status: 200, json: async () => mockTokenResponse };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ searchResult: { items: [] } })
      };
    };

    const adapter = new AmazonCreatorsAdapter({
      credentialId: 'cred',
      credentialSecret: 'secret',
      partnerTag: 'tag-21'
    });

    const results = await adapter.search('unknown item');
    assert.deepStrictEqual(results, []);
  });

  test('AMZ-5. Timeout: aborts and throws error when API times out', async () => {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/auth/o2/token')) {
        return { ok: true, status: 200, json: async () => mockTokenResponse };
      }
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      throw abortError;
    };

    const adapter = new AmazonCreatorsAdapter({
      credentialId: 'cred',
      credentialSecret: 'secret',
      partnerTag: 'tag-21',
      timeoutMs: 50
    });

    await assert.rejects(
      async () => {
        await adapter.search('iphone 16');
      },
      /timed out after 50ms/
    );
  });
});

test.describe('Phase 2: Store Adapter Registry & Flags', () => {
  test('REG-1. Amazon & Flipkart are disabled by default in registry', () => {
    assert.strictEqual(
      adapterRegistry.isEnabled('amazon'),
      false,
      'Amazon adapter must be disabled by default'
    );
    assert.strictEqual(
      adapterRegistry.isEnabled('flipkart'),
      false,
      'Flipkart adapter must be disabled by default'
    );

    const enabledAdapters = adapterRegistry.getAll();
    assert.ok(
      !enabledAdapters.some((a) => a.slug === 'amazon'),
      'Amazon must not appear in getAll() by default'
    );
    assert.ok(
      !enabledAdapters.some((a) => a.slug === 'flipkart'),
      'Flipkart must not appear in getAll() by default'
    );
  });

  test('REG-2. Registry getStoreMetadata indicates isEnabled: false for Phase 2 stores', () => {
    const meta = adapterRegistry.getStoreMetadata();
    const amazonMeta = meta.find((m) => m.slug === 'amazon');
    const flipkartMeta = meta.find((m) => m.slug === 'flipkart');

    assert.ok(amazonMeta, 'Amazon metadata must be present');
    assert.strictEqual(amazonMeta.isEnabled, false);

    assert.ok(flipkartMeta, 'Flipkart metadata must be present');
    assert.strictEqual(flipkartMeta.isEnabled, false);
  });

  test('REG-3. When ENABLE_FLIPKART=true but keys are missing, adapter is safely skipped without crashing', () => {
    const originalEnable = process.env.ENABLE_FLIPKART;
    const originalId = process.env.FLIPKART_AFFILIATE_ID;
    const originalToken = process.env.FLIPKART_AFFILIATE_TOKEN;

    try {
      process.env.ENABLE_FLIPKART = 'true';
      delete process.env.FLIPKART_AFFILIATE_ID;
      delete process.env.FLIPKART_AFFILIATE_TOKEN;

      // Constructing registry must not throw an uncaught error
      const reg = new StoreAdapterRegistry();
      assert.strictEqual(
        reg.isEnabled('flipkart'),
        false,
        'Flipkart adapter must remain disabled when credentials are missing'
      );
    } finally {
      process.env.ENABLE_FLIPKART = originalEnable;
      process.env.FLIPKART_AFFILIATE_ID = originalId;
      process.env.FLIPKART_AFFILIATE_TOKEN = originalToken;
    }
  });

  test('REG-4. When ENABLE_AMAZON=true but credentials are missing, adapter is safely skipped without crashing', () => {
    const originalEnable = process.env.ENABLE_AMAZON;
    const originalCredId = process.env.AMAZON_CREDENTIAL_ID;
    const originalSecret = process.env.AMAZON_CREDENTIAL_SECRET;
    const originalTag = process.env.AMAZON_PARTNER_TAG;

    try {
      process.env.ENABLE_AMAZON = 'true';
      delete process.env.AMAZON_CREDENTIAL_ID;
      delete process.env.AMAZON_CREDENTIAL_SECRET;
      delete process.env.AMAZON_PARTNER_TAG;

      // Constructing registry must not throw an uncaught error
      const reg = new StoreAdapterRegistry();
      assert.strictEqual(
        reg.isEnabled('amazon'),
        false,
        'Amazon adapter must remain disabled when credentials are missing'
      );
    } finally {
      process.env.ENABLE_AMAZON = originalEnable;
      process.env.AMAZON_CREDENTIAL_ID = originalCredId;
      process.env.AMAZON_CREDENTIAL_SECRET = originalSecret;
      process.env.AMAZON_PARTNER_TAG = originalTag;
    }
  });
});

test.describe('Phase 2: Deduplication & Direct API Priority Merge', () => {
  test('DEDUP-1. Direct Amazon result takes priority over SerpApi Amazon duplicate (similar title)', () => {
    const directAmazonOffer = {
      store: 'Amazon',
      storeSlug: 'amazon',
      title: 'Apple iPhone 16 (128 GB) - Black',
      price: 69999,
      isDirectApi: true,
      isDirect: true,
      url: 'https://amazon.in/dp/direct'
    };

    const serpApiAmazonOffer = {
      store: 'Amazon.in',
      storeSlug: 'amazon',
      title: 'Apple iPhone 16 128GB Black Smartphone',
      price: 70499,
      isDirectApi: false,
      url: 'https://serpapi.com/link/amazon'
    };

    const serpApiCromaOffer = {
      store: 'Croma',
      storeSlug: 'croma',
      title: 'Apple iPhone 16 (128GB, Black)',
      price: 69900,
      isDirectApi: false,
      url: 'https://croma.com/iphone-16'
    };

    const merged = mergeAndDeduplicateOffers([
      directAmazonOffer,
      serpApiAmazonOffer,
      serpApiCromaOffer
    ]);

    // SerpApi Amazon offer should be dropped; Direct Amazon and Croma should remain
    assert.strictEqual(merged.length, 2);
    assert.ok(merged.includes(directAmazonOffer), 'Direct Amazon offer must be preserved');
    assert.ok(merged.includes(serpApiCromaOffer), 'Croma offer must be preserved');
    assert.ok(!merged.includes(serpApiAmazonOffer), 'SerpApi duplicate must be removed');
  });

  test('DEDUP-2. Direct Flipkart result takes priority over SerpApi Flipkart duplicate', () => {
    const directFlipkart = {
      store: 'Flipkart',
      storeSlug: 'flipkart',
      title: 'Apple iPhone 16 (Black, 128 GB)',
      price: 67999,
      isDirectApi: true,
      isDirect: true,
      url: 'https://flipkart.com/direct'
    };

    const serpApiFlipkart = {
      store: 'Flipkart',
      storeSlug: 'flipkart',
      title: 'Apple iPhone 16 Black 128 GB',
      price: 68499,
      isDirectApi: false,
      url: 'https://serpapi.com/link/flipkart'
    };

    const merged = mergeAndDeduplicateOffers([serpApiFlipkart, directFlipkart]);

    assert.strictEqual(merged.length, 1);
    assert.strictEqual(merged[0].url, directFlipkart.url);
    assert.strictEqual(merged[0].isDirectApi, true);
  });

  test('DEDUP-3. Same store but distinctly different products are NOT treated as duplicates', () => {
    const directAmazonIphone16 = {
      store: 'Amazon',
      storeSlug: 'amazon',
      title: 'Apple iPhone 16 (128 GB) - Black',
      price: 69999,
      isDirectApi: true
    };

    const serpApiAmazonIphone15 = {
      store: 'Amazon.in',
      storeSlug: 'amazon',
      title: 'Apple iPhone 15 (128 GB) - Black',
      price: 58999,
      isDirectApi: false
    };

    const merged = mergeAndDeduplicateOffers([directAmazonIphone16, serpApiAmazonIphone15]);
    assert.strictEqual(merged.length, 2, 'Different model numbers (16 vs 15) must not be deduplicated');
  });

  test('DEDUP-4. areTitlesSimilar correctly compares matching and non-matching titles', () => {
    assert.strictEqual(
      areTitlesSimilar(
        'Apple iPhone 16 (128 GB) - Black',
        'Apple iPhone 16 128GB Black Smartphone'
      ),
      true,
      'Same product with minor keyword variation should match'
    );

    assert.strictEqual(
      areTitlesSimilar(
        'Apple iPhone 16 (128 GB)',
        'Apple iPhone 15 (128 GB)'
      ),
      false,
      'Different generation models should not match'
    );

    assert.strictEqual(
      areTitlesSimilar(
        'Sony WH-1000XM5 Wireless Headphones',
        'Sony WH-1000XM5 Noise Cancelling Over-Ear'
      ),
      true,
      'Headphones with matching model code should match'
    );
  });
});
