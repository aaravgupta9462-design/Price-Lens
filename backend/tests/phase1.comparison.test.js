import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { SerpApiShoppingAdapter } from '../src/adapters/SerpApiShoppingAdapter.js';
import { adapterRegistry } from '../src/adapters/index.js';
import { cacheService } from '../src/utils/cache.util.js';
import { comparisonService } from '../src/services/comparison.service.js';

import prisma from '../src/config/db.js';

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/v1`;
});

test.after(async () => {
  if (server) server.close();
  await prisma.$disconnect().catch(() => {});
});

test.describe('Phase 1: Architecture & SerpApi Integration', () => {
  test('1. SerpApiShoppingAdapter conforms to standard offer shape', async () => {
    const adapter = new SerpApiShoppingAdapter();
    const offers = await adapter.search('iphone 16');

    assert.ok(Array.isArray(offers), 'Offers must be an array');
    assert.ok(offers.length > 0, 'Should return offers for known product');

    const first = offers[0];
    // Check user-specified required contract
    assert.ok(typeof first.store === 'string', 'store must be string');
    assert.ok(typeof first.title === 'string', 'title must be string');
    assert.ok(typeof first.price === 'number', 'price must be number');
    assert.ok(typeof first.currency === 'string', 'currency must be string');
    assert.ok(typeof first.url === 'string', 'url must be string');
    assert.ok(typeof first.image === 'string', 'image must be string');
    assert.ok(typeof first.inStock === 'boolean', 'inStock must be boolean');
    assert.ok(typeof first.fetchedAt === 'string', 'fetchedAt must be string');

    // Check UI compatibility properties
    assert.ok(typeof first.productUrl === 'string', 'productUrl must be present for frontend');
    assert.ok(typeof first.imageUrl === 'string', 'imageUrl must be present for frontend');
    assert.ok(typeof first.storeEmoji === 'string', 'storeEmoji must be present');
    assert.ok(typeof first.storeSlug === 'string', 'storeSlug must be present');
  });

  test('2. Adapter Registry supports enabling and disabling by slug', () => {
    const testSlug = 'serpapi';
    assert.ok(adapterRegistry.get(testSlug), 'SerpApi adapter should be registered');

    adapterRegistry.disable(testSlug);
    assert.strictEqual(adapterRegistry.isEnabled(testSlug), false, 'Should be disabled');
    const enabledAfterDisable = adapterRegistry.getAll();
    assert.ok(!enabledAfterDisable.some((a) => a.slug === testSlug), 'Should not appear in getAll()');

    adapterRegistry.enable(testSlug);
    assert.strictEqual(adapterRegistry.isEnabled(testSlug), true, 'Should be enabled again');
    const enabledAfterEnable = adapterRegistry.getAll();
    assert.ok(enabledAfterEnable.some((a) => a.slug === testSlug), 'Should appear in getAll()');
  });

  test('3. MemoryCache handles get, set, TTL expiry and eviction', async () => {
    const testKey = 'test:cache:key';
    await cacheService.set(testKey, { hello: 'world' }, 1); // 1 second TTL

    const cachedVal = await cacheService.get(testKey);
    assert.deepStrictEqual(cachedVal, { hello: 'world' });

    // Wait for 1.1s for TTL expiration
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const expiredVal = await cacheService.get(testKey);
    assert.strictEqual(expiredVal, null, 'Expired key should return null');
  });

  test('4. ComparisonService sorts offers ascending by price and identifies Best Deal', async () => {
    // Clear cache to test live query
    await cacheService.del('compare:iphone 16');

    const result = await comparisonService.compareQuery('iphone 16', { bypassCache: true });

    assert.ok(result.offers.length > 0, 'Offers must not be empty');
    // Verify ascending sort
    for (let i = 0; i < result.offers.length - 1; i++) {
      assert.ok(
        result.offers[i].price <= result.offers[i + 1].price,
        `Offers must be sorted ascending: ${result.offers[i].price} <= ${result.offers[i + 1].price}`
      );
    }

    assert.ok(result.bestDeal, 'Best deal should be computed');
    assert.strictEqual(
      result.bestDeal.price,
      result.lowestPrice,
      'Best deal price should equal lowest valid price'
    );
  });

  test('5. ComparisonService caches query results on second lookup', async () => {
    const query = 'sony xm5';
    await cacheService.del(`compare:${query}`);

    const res1 = await comparisonService.compareQuery(query);
    assert.strictEqual(res1.isCached, undefined);

    const res2 = await comparisonService.compareQuery(query);
    assert.strictEqual(res2.isCached, true, 'Second query should be served from cache');
  });

  test('6. GET /v1/compare/stores returns registered store adapters with metadata', async () => {
    const response = await fetch(`${baseUrl}/compare/stores`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data), 'Stores data should be array');
    assert.ok(
      body.data.some((s) => s.slug === 'serpapi'),
      'SerpApi adapter should be in stores list'
    );
  });

  test('7. GET /v1/compare?q=macbook returns comparison offers via HTTP endpoint', async () => {
    const response = await fetch(`${baseUrl}/compare?q=macbook`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.offers.length > 0, 'Should return offers for macbook');
    assert.ok(body.data.lowestPrice > 0, 'Lowest price should be positive number');
  });
});
