import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  filterComparisonOffers,
  filterComparisonOffersWithReport,
  calculateMedian,
  matchesAccessoryKeyword,
  getActiveAccessoryKeywords,
  isBannedStore,
  matchesQueryRelevance,
  checkVariantMatch,
  isForeignStore,
  matchesCarrierLockedKeyword,
  determineCondition,
  queryRequestsRefurbished
} from '../src/utils/resultFilter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('ResultFilter Utility Unit Tests', () => {
  test('1. Accessory keywords filter eliminates cases, covers, protectors and chargers', () => {
    const activeKeywords = getActiveAccessoryKeywords('iphone 15');

    assert.ok(matchesAccessoryKeyword('iPhone 15 Matte Silicone Case', activeKeywords));
    assert.ok(matchesAccessoryKeyword('iPhone 15 Back Cover Transparent', activeKeywords));
    assert.ok(matchesAccessoryKeyword('Tempered Glass Screen Guard for iPhone 15', activeKeywords));
    assert.ok(matchesAccessoryKeyword('20W USB-C Fast Charger for iPhone 15', activeKeywords));
    assert.ok(matchesAccessoryKeyword('Braided Lightning to Type-C Cable', activeKeywords));

    // Real phone should NOT match any accessory keyword
    assert.strictEqual(matchesAccessoryKeyword('Apple iPhone 15 (128 GB) - Black', activeKeywords), null);
    assert.strictEqual(matchesAccessoryKeyword('Apple iPhone 15 Plus 256GB Blue', activeKeywords), null);
  });

  test('2. Accessory filter is bypassed when user explicitly queries for an accessory', () => {
    const activeKeywords = getActiveAccessoryKeywords('iphone 15 case');
    assert.ok(!activeKeywords.includes('case'), 'Case keyword must be excluded when query contains "case"');

    const result = filterComparisonOffersWithReport(
      [
        { store: 'Croma', title: 'iPhone 15 Silicone Case with MagSafe', price: 4900 },
        { store: 'Amazon.in', title: 'iPhone 15 Leather Case', price: 5900 }
      ],
      'iphone 15 case'
    );

    assert.strictEqual(result.passedOffers.length, 2, 'Cases should pass when user searched for "iphone 15 case"');
    assert.strictEqual(result.stats.rejectedAccessory, 0);
  });

  test('3. Banned and unknown merchant store names are rejected', () => {
    assert.strictEqual(isBannedStore('Online Merchant'), true);
    assert.strictEqual(isBannedStore('online-merchant'), true);
    assert.strictEqual(isBannedStore('Unknown'), true);
    assert.strictEqual(isBannedStore(''), true);
    assert.strictEqual(isBannedStore('  '), true);

    // Legitimate stores must pass
    assert.strictEqual(isBannedStore('Amazon.in'), false);
    assert.strictEqual(isBannedStore('Flipkart'), false);
    assert.strictEqual(isBannedStore('Croma'), false);
    assert.strictEqual(isBannedStore('Reliance Digital'), false);
    assert.strictEqual(isBannedStore('lpbirla.com'), false);
  });

  test('4. Relevance filter ensures all main query keywords exist in the title', () => {
    const query = 'iphone 15';

    assert.strictEqual(matchesQueryRelevance('Apple iPhone 15 128GB Black', query), true);
    assert.strictEqual(matchesQueryRelevance('iPhone 15 Plus (256 GB)', query), true);

    // Irrelevant titles must fail
    assert.strictEqual(matchesQueryRelevance('Samsung Galaxy S24 Ultra 5G', query), false);
    assert.strictEqual(matchesQueryRelevance('Apple iPhone 14 128GB', query), false, 'Missing "15" keyword');
    assert.strictEqual(matchesQueryRelevance('OnePlus 12R 5G 16GB RAM', query), false);
  });

  test('5. Variant matching: Rejects Plus, Pro, Max, Ultra when base model is searched', () => {
    const baseQuery = 'iphone 15';

    assert.strictEqual(checkVariantMatch('Apple iPhone 15 128GB Black', baseQuery).isMatch, true);

    const plusCheck = checkVariantMatch('Apple iPhone 15 Plus 256GB Blue', baseQuery);
    assert.strictEqual(plusCheck.isMatch, false);
    assert.deepStrictEqual(plusCheck.unmatchedVariants, ['plus']);

    const proCheck = checkVariantMatch('Apple iPhone 15 Pro 128GB Titanium', baseQuery);
    assert.strictEqual(proCheck.isMatch, false);
    assert.deepStrictEqual(proCheck.unmatchedVariants, ['pro']);

    const maxCheck = checkVariantMatch('Apple iPhone 15 Pro Max 256GB', baseQuery);
    assert.strictEqual(maxCheck.isMatch, false);
    assert.deepStrictEqual(maxCheck.unmatchedVariants, ['pro', 'max']);
  });

  test('6. Variant matching: Allows specific requested variant but rejects cross-variants', () => {
    const proQuery = 'iphone 15 pro';

    assert.strictEqual(checkVariantMatch('Apple iPhone 15 Pro 128GB Natural Titanium', proQuery).isMatch, true);

    const proMaxCheck = checkVariantMatch('Apple iPhone 15 Pro Max 256GB', proQuery);
    assert.strictEqual(proMaxCheck.isMatch, false);
    assert.deepStrictEqual(proMaxCheck.unmatchedVariants, ['max']);

    const plusCheck = checkVariantMatch('Apple iPhone 15 Plus 128GB', proQuery);
    assert.strictEqual(plusCheck.isMatch, false);
    assert.deepStrictEqual(plusCheck.unmatchedVariants, ['plus']);
  });

  test('7. Outlier price filter: Enforces 60% of median price cutoff', () => {
    const mockOffers = [
      { store: 'StoreA', title: 'Apple iPhone 15 128GB', price: 65000 },
      { store: 'StoreB', title: 'Apple iPhone 15 128GB', price: 66000 },
      { store: 'StoreC', title: 'Apple iPhone 15 128GB', price: 70000 },
      { store: 'StoreD', title: 'Apple iPhone 15 128GB', price: 30000 }, // < 60% of median (39,000)
      { store: 'StoreE', title: 'Apple iPhone 15 128GB', price: 500 }
    ];

    const result = filterComparisonOffersWithReport(mockOffers, 'iphone 15', { outlierRatio: 0.6 });

    assert.strictEqual(result.stats.medianPrice, 65000);
    assert.strictEqual(result.stats.minAllowedPrice, 39000);
    assert.strictEqual(result.stats.rejectedPriceOutlier, 2);
    assert.strictEqual(result.passedOffers.length, 3);
  });

  test('8. Carrier-locked filter: Rejects locked carrier phones (Verizon, Cricket, Tracfone, etc.)', () => {
    const query = 'iphone 15';

    assert.ok(matchesCarrierLockedKeyword('iPhone 15, 128GB, Yellow - Locked to Cricket', query));
    assert.ok(matchesCarrierLockedKeyword('iPhone 15, 128GB, Pink - Locked to Verizon (Renewed)', query));
    assert.ok(matchesCarrierLockedKeyword('iPhone 15 128GB Verizon Only Clean IMEI', query));
    assert.ok(matchesCarrierLockedKeyword('iPhone 15 128GB AT&T locked', query));
    assert.ok(matchesCarrierLockedKeyword('Apple iPhone 15 T-Mobile locked', query));

    // Factory unlocked Indian phones should pass
    assert.strictEqual(matchesCarrierLockedKeyword('Apple iPhone 15 (128 GB) - Black', query), null);
    assert.strictEqual(matchesCarrierLockedKeyword('Apple iPhone 15 128GB Blue (Factory Unlocked)', query), null);
  });

  test('9. Foreign store filter: Rejects foreign domain TLDs (.ae, .sa, .com.sa, .co.uk, etc.)', () => {
    assert.strictEqual(isForeignStore('Desertcart.ae'), '.ae');
    assert.strictEqual(isForeignStore('desertcart.com.sa'), '.sa');
    assert.strictEqual(isForeignStore('fonezone.me.uk'), false); // not in list
    assert.strictEqual(isForeignStore('shop.co.uk'), '.co.uk');
    assert.strictEqual(isForeignStore('deals.com.au'), '.com.au');
    assert.strictEqual(isForeignStore('store.sg'), '.sg');

    // Indian stores must pass
    assert.strictEqual(isForeignStore('Amazon.in'), false);
    assert.strictEqual(isForeignStore('Flipkart'), false);
    assert.strictEqual(isForeignStore('Croma'), false);
    assert.strictEqual(isForeignStore('ubuy.co.in'), false);
  });

  test('10. Condition classification: Tags renewed/refurbished and filters when not searched', () => {
    assert.strictEqual(determineCondition('Apple iPhone 15 (Renewed)'), 'refurbished');
    assert.strictEqual(determineCondition('Apple iPhone 15 Refurbished 128GB'), 'refurbished');
    assert.strictEqual(determineCondition('Apple iPhone 15 Pre-Owned Very Good'), 'refurbished');
    assert.strictEqual(determineCondition('Apple iPhone 15 (128 GB) - Black'), 'new');

    const offers = [
      { store: 'Croma', title: 'Apple iPhone 15 (128 GB) - Black', price: 65999 },
      { store: 'Cashify', title: 'Apple iPhone 15 128GB (Refurbished)', price: 49999 }
    ];

    // Standard search: rejects refurbished
    const defaultRes = filterComparisonOffersWithReport(offers, 'iphone 15');
    assert.strictEqual(defaultRes.stats.refurbishedCount, 1);
    assert.strictEqual(defaultRes.stats.rejectedRefurbished, 1);
    assert.strictEqual(defaultRes.passedOffers.length, 1);
    assert.strictEqual(defaultRes.passedOffers[0].condition, 'new');

    // Search explicitly asking for refurbished: allows refurbished
    const refurbRes = filterComparisonOffersWithReport(offers, 'iphone 15 refurbished');
    assert.strictEqual(refurbRes.stats.rejectedRefurbished, 0);
    assert.strictEqual(refurbRes.passedOffers.length, 2);
  });

  test('11. Real Raw Fixture Test (serpapi_iphone15.json): Validates complete audit on real data', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'serpapi_iphone15.json');
    assert.ok(fs.existsSync(fixturePath), 'Fixture file must exist');

    const rawOffers = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    assert.strictEqual(rawOffers.length, 36, 'Should load all 36 raw offers from previous search');

    const result = filterComparisonOffersWithReport(rawOffers, 'iphone 15');

    // Asserts on filter behavior
    assert.ok(result.stats.rejectedVariant > 0, 'Must reject variant mismatches (Pro, Plus, Max)');
    assert.ok(result.stats.rejectedPriceOutlier > 0, 'Must reject price outliers (< 60% of median)');
    assert.ok(result.stats.rejectedForeignStore > 0 || result.stats.rejectedCarrierLocked > 0, 'Must reject foreign or carrier-locked stores');
    assert.ok(result.stats.refurbishedCount > 0, 'Must detect refurbished counts');
  });

  test('12. Regression: Broad reference set calculates market median and prevents skewed outlier cutoff', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'serpapi_iphone15.json');
    const rawOffers = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

    const result = filterComparisonOffersWithReport(rawOffers, 'iphone 15');

    // 1. Reference set includes 25 offers (relevance + not banned store + not accessory),
    // retaining variant, carrier-locked, and foreign store offers for realistic pricing
    assert.strictEqual(result.stats.referenceCount, 25);
    assert.strictEqual(result.stats.referenceMedian, 51999);
    assert.strictEqual(result.stats.minAllowedPrice, 31199);

    // 2. Outlier cutoff rejected the extreme junk/case offer (< 31199)
    const nakedCaseRejection = result.filteredOut.find((f) => f.offer.store.toLowerCase().includes('nakedcase'));
    assert.ok(nakedCaseRejection, 'nakedcase.in (₹399) must be rejected');
    assert.strictEqual(nakedCaseRejection.reason, 'PRICE_OUTLIER');

    // 3. Low confidence flag triggered when final passed offers < 3
    assert.strictEqual(result.passedOffers.length, 2);
    assert.strictEqual(result.lowConfidence, true);
    assert.strictEqual(result.confidenceMessage, 'Kam reliable results mile');
  });

  test('13. Outlier filter bypasses when reference set has fewer than 5 offers and sets lowConfidence: true', () => {
    const scarceOffers = [
      { store: 'Croma', title: 'Apple iPhone 15 128GB', price: 65000 },
      { store: 'Reliance Digital', title: 'Apple iPhone 15 128GB', price: 66000 },
      { store: 'Vijay Sales', title: 'Apple iPhone 15 128GB', price: 20000 } // Extreme low price but reference < 5
    ];

    const result = filterComparisonOffersWithReport(scarceOffers, 'iphone 15');

    // Reference set < 5 -> outlier filter NOT applied
    assert.strictEqual(result.stats.referenceCount, 3);
    assert.strictEqual(result.stats.rejectedPriceOutlier, 0);
    assert.strictEqual(result.passedOffers.length, 3);
    assert.strictEqual(result.lowConfidence, true);
    assert.strictEqual(result.confidenceMessage, 'Kam reliable results mile');
  });

  test('14. Upper outlier rule: Rejects prices exceeding referenceMedian * 2.0 with reason PRICE_OUTLIER_HIGH', () => {
    // 5 reference offers with median = 65000; maxAllowed = 65000 * 2.0 = 130000
    const offers = [
      { store: 'Croma', title: 'Apple iPhone 15 128GB Blue', price: 60000 },
      { store: 'Reliance Digital', title: 'Apple iPhone 15 128GB Black', price: 65000 },
      { store: 'Vijay Sales', title: 'Apple iPhone 15 128GB Green', price: 65000 },
      { store: 'Amazon.in', title: 'Apple iPhone 15 128GB Pink', price: 70000 },
      { store: 'Flipkart', title: 'Apple iPhone 15 128GB Yellow', price: 72000 },
      { store: 'Luxury Boutique', title: 'Apple iPhone 15 128GB Gold Custom', price: 175000 } // Above 130000
    ];

    const result = filterComparisonOffersWithReport(offers, 'iphone 15');

    assert.strictEqual(result.stats.referenceMedian, 67500);
    assert.strictEqual(result.stats.minAllowedPrice, 40500);
    assert.strictEqual(result.stats.maxAllowedPrice, 135000);
    assert.strictEqual(result.stats.rejectedPriceOutlierHigh, 1);

    const highOutlier = result.filteredOut.find((f) => f.offer.store === 'Luxury Boutique');
    assert.ok(highOutlier, 'Luxury Boutique (₹1,75,000) must be rejected');
    assert.strictEqual(highOutlier.reason, 'PRICE_OUTLIER_HIGH');
    assert.ok(highOutlier.detail.includes('above 2x of reference median'));

    // The other 5 offers must pass
    assert.strictEqual(result.passedOffers.length, 5);
  });

  test('15. Fixture audit: Real ₹14.28 lakh TikTok offer rejected with reason PRICE_OUTLIER_HIGH on pro max query', () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'serpapi_iphone15.json');
    const rawOffers = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

    const result = filterComparisonOffersWithReport(rawOffers, 'iphone 15 pro max', { allowRefurbished: true });

    assert.strictEqual(result.stats.rejectedPriceOutlierHigh, 1);
    const tikTokOutlier = result.filteredOut.find(
      (f) => f.offer.price === 1428908 && f.reason === 'PRICE_OUTLIER_HIGH'
    );
    assert.ok(tikTokOutlier, '₹14,28,908 offer must be rejected with PRICE_OUTLIER_HIGH');
    assert.strictEqual(tikTokOutlier.reason, 'PRICE_OUTLIER_HIGH');
  });
});

