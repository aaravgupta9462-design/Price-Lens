/**
 * ResultFilter Utility
 * 
 * Filters raw comparison search offers to eliminate junk, accessories,
 * price outliers, unknown merchants, variant mismatches, carrier-locked devices,
 * foreign stores, and refurbished products (when not explicitly searched).
 */

export const ACCESSORY_KEYWORDS = [
  'back cover',
  'screen guard',
  'tempered glass',
  'case',
  'cover',
  'skin',
  'protector',
  'tempered',
  'glass',
  'charger',
  'cable',
  'adapter',
  'strap',
  'stand',
  'holder',
  'sticker',
  'pouch'
];

export const BANNED_STORE_NAMES = [
  'online merchant',
  'online-merchant',
  'unknown',
  'unknown store',
  'various',
  'merchant',
  'n/a'
];

export const KNOWN_VARIANT_WORDS = [
  'plus',
  'pro',
  'max',
  'ultra',
  'mini',
  'lite',
  'fe'
];

// Carrier-locked keywords to reject
export const CARRIER_LOCKED_KEYWORDS = [
  'locked to',
  'carrier locked',
  'us version',
  'verizon',
  'tracfone',
  'cricket',
  'at&t',
  't-mobile',
  'boost mobile',
  'metro',
  'straight talk'
];

// Foreign store TLDs to reject (not domestic Indian e-commerce)
export const DEFAULT_FOREIGN_TLDS = [
  '.ae',
  '.sa',
  '.com.sa',
  '.co.uk',
  '.com.au',
  '.sg',
  '.jp',
  '.de',
  '.ca'
];

// Refurbished keywords for condition classification
export const REFURBISHED_KEYWORDS = [
  'renewed',
  'refurbished',
  'pre-owned',
  'used',
  'open box',
  'second hand',
  'like new'
];

export const STOP_WORDS = new Set([
  'for',
  'the',
  'a',
  'an',
  'in',
  'and',
  'with',
  'of',
  'to',
  'at',
  'on',
  'by',
  'is',
  'or'
]);

// Filter schema / rule version for cache busting
export const FILTER_VERSION = '1.2.0';

// Configurable outlier ratio: 60% of reference median price default (lower threshold)
export const DEFAULT_PRICE_OUTLIER_RATIO = 0.6;

// Configurable upper outlier ratio: 2x (200%) of reference median price default (upper threshold)
export const DEFAULT_PRICE_OUTLIER_MAX_RATIO = 2.0;

/**
 * Get current configured outlier ratio (lower threshold)
 * @returns {number}
 */
export function getPriceOutlierRatio() {
  if (process.env.PRICE_OUTLIER_RATIO) {
    const parsed = parseFloat(process.env.PRICE_OUTLIER_RATIO);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 1.0) {
      return parsed;
    }
  }
  return DEFAULT_PRICE_OUTLIER_RATIO;
}

/**
 * Get current configured upper outlier ratio (upper threshold)
 * @returns {number}
 */
export function getPriceOutlierMaxRatio() {
  if (process.env.PRICE_OUTLIER_MAX_RATIO) {
    const parsed = parseFloat(process.env.PRICE_OUTLIER_MAX_RATIO);
    if (!isNaN(parsed) && parsed > 1.0) {
      return parsed;
    }
  }
  return DEFAULT_PRICE_OUTLIER_MAX_RATIO;
}

/**
 * Get configured foreign store TLDs
 * @returns {Array<string>}
 */
export function getForeignTlds() {
  if (process.env.FOREIGN_STORE_TLDS) {
    return process.env.FOREIGN_STORE_TLDS.split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return DEFAULT_FOREIGN_TLDS;
}

/**
 * Check if store is hosted on a foreign domain TLD
 * @param {string} store
 * @param {Array<string>} [foreignTlds]
 * @returns {string|false} Matched TLD or false
 */
export function isForeignStore(store, foreignTlds = getForeignTlds()) {
  if (!store || typeof store !== 'string') return false;
  const storeLower = store.trim().toLowerCase();

  for (const tld of foreignTlds) {
    if (storeLower.endsWith(tld) || storeLower.includes(tld + '/') || storeLower.includes(tld + ' ')) {
      return tld;
    }
  }
  return false;
}

/**
 * Determine condition of an item from its title
 * @param {string} title
 * @returns {'new'|'refurbished'}
 */
export function determineCondition(title) {
  if (!title) return 'new';
  const titleLower = String(title).toLowerCase();

  for (const kw of REFURBISHED_KEYWORDS) {
    if (kw.includes(' ')) {
      if (titleLower.includes(kw)) return 'refurbished';
    } else {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(titleLower)) return 'refurbished';
    }
  }
  return 'new';
}

/**
 * Check if user query explicitly asked for refurbished or used items
 * @param {string} query
 * @returns {boolean}
 */
export function queryRequestsRefurbished(query) {
  if (!query) return false;
  const qLower = String(query).toLowerCase();
  return ['refurbished', 'used', 'renewed', 'pre-owned', 'second hand', 'open box', 'like new'].some((kw) =>
    qLower.includes(kw)
  );
}

/**
 * Extract active carrier-locked keywords (excluding any keywords the user explicitly queried)
 * @param {string} query
 * @returns {Array<string>}
 */
export function getActiveCarrierLockedKeywords(query) {
  const queryLower = String(query || '').toLowerCase().trim();
  return CARRIER_LOCKED_KEYWORDS.filter((kw) => !queryLower.includes(kw));
}

/**
 * Check if a title matches any carrier-locked keywords
 * @param {string} title
 * @param {string} query
 * @returns {string|null}
 */
export function matchesCarrierLockedKeyword(title, query) {
  if (!title) return null;
  const activeKeywords = getActiveCarrierLockedKeywords(query);
  const titleLower = String(title).toLowerCase();

  for (const kw of activeKeywords) {
    if (kw.includes(' ') || kw.includes('&') || kw.includes('-')) {
      if (titleLower.includes(kw)) {
        return kw;
      }
    } else {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(titleLower)) {
        return kw;
      }
    }
  }

  return null;
}

/**
 * Calculate median from an array of numbers
 * @param {Array<number>} numbers
 * @returns {number}
 */
export function calculateMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sorted = [...numbers].filter((n) => typeof n === 'number' && !isNaN(n) && n > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;

  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Extract active accessory keywords (excluding any keywords the user explicitly searched for)
 * @param {string} query
 * @returns {Array<string>}
 */
export function getActiveAccessoryKeywords(query) {
  const queryLower = String(query || '').toLowerCase().trim();
  return ACCESSORY_KEYWORDS.filter((kw) => !queryLower.includes(kw));
}

/**
 * Check if a title matches any accessory keywords
 * @param {string} title
 * @param {Array<string>} activeKeywords
 * @returns {string|null} Matched keyword or null
 */
export function matchesAccessoryKeyword(title, activeKeywords) {
  if (!title || !Array.isArray(activeKeywords) || activeKeywords.length === 0) {
    return null;
  }
  const titleLower = String(title).toLowerCase();

  for (const kw of activeKeywords) {
    if (kw.includes(' ')) {
      if (titleLower.includes(kw)) {
        return kw;
      }
    } else {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(titleLower)) {
        return kw;
      }
    }
  }

  return null;
}

/**
 * Check variant alignment between title and user query
 * @param {string} title
 * @param {string} query
 * @returns {{ isMatch: boolean, unmatchedVariants?: Array<string>, detail?: string }}
 */
export function checkVariantMatch(title, query) {
  if (!title || !query) return { isMatch: true };

  const queryTokens = String(query)
    .toLowerCase()
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  const queryVariants = KNOWN_VARIANT_WORDS.filter((vw) => queryTokens.includes(vw));

  const titleLower = String(title).toLowerCase();
  const titleVariants = KNOWN_VARIANT_WORDS.filter((vw) => {
    const regex = new RegExp(`\\b${vw}\\b`, 'i');
    return regex.test(titleLower);
  });

  const unmatchedVariants = titleVariants.filter((vw) => !queryVariants.includes(vw));

  if (unmatchedVariants.length > 0) {
    return {
      isMatch: false,
      unmatchedVariants,
      detail: `Title contains unexpected variant "${unmatchedVariants.join(', ')}"`
    };
  }

  return { isMatch: true, queryVariants, titleVariants };
}

/**
 * Check if store name is unknown or banned
 * @param {string} store
 * @returns {boolean}
 */
export function isBannedStore(store) {
  if (!store || typeof store !== 'string') return true;
  const clean = store.trim().toLowerCase();
  if (clean.length < 2) return true;
  return BANNED_STORE_NAMES.includes(clean);
}

/**
 * Check if title contains the main significant words from user search query
 * @param {string} title
 * @param {string} query
 * @returns {boolean}
 */
export function matchesQueryRelevance(title, query) {
  if (!title || !query) return false;
  const titleLower = String(title).toLowerCase();
  const queryTokens = String(query)
    .toLowerCase()
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w) && !REFURBISHED_KEYWORDS.includes(w));

  if (queryTokens.length === 0) return true;

  return queryTokens.every((token) => titleLower.includes(token));
}

/**
 * Check if an offer qualifies for the market reference price set
 * Reference set includes offers that are relevant, from valid stores, and not accessories.
 * (Variant, foreign store, and carrier-locked offers are kept in the reference set
 * because their prices reflect broad market reality).
 * @param {Object} offer
 * @param {string} query
 * @param {Array<string>} activeAccessories
 * @returns {boolean}
 */
export function isInReferencePriceSet(offer, query, activeAccessories) {
  if (!offer) return false;
  if (isBannedStore(offer.store)) return false;
  if (matchesAccessoryKeyword(offer.title, activeAccessories)) return false;
  if (!matchesQueryRelevance(offer.title, query)) return false;
  return true;
}

/**
 * Filter offers with detailed rejection reporting, market reference median, and confidence scoring
 * @param {Array<Object>} offers
 * @param {string} query
 * @param {Object} [options]
 * @returns {{ passedOffers: Array<Object>, filteredOut: Array<Object>, stats: Object, lowConfidence: boolean, confidenceMessage: string|null }}
 */
export function filterComparisonOffersWithReport(offers, query, options = {}) {
  if (!Array.isArray(offers) || offers.length === 0) {
    return {
      passedOffers: [],
      filteredOut: [],
      lowConfidence: true,
      confidenceMessage: 'Kam reliable results mile',
      stats: {
        total: 0,
        passed: 0,
        referenceCount: 0,
        referenceMedian: 0,
        medianPrice: 0,
        minAllowedPrice: 0,
        maxAllowedPrice: 0,
        outlierRatio: getPriceOutlierRatio(),
        outlierMaxRatio: getPriceOutlierMaxRatio(),
        lowConfidence: true,
        confidenceMessage: 'Kam reliable results mile',
        refurbishedCount: 0,
        rejectedStore: 0,
        rejectedForeignStore: 0,
        rejectedCarrierLocked: 0,
        rejectedRefurbished: 0,
        rejectedAccessory: 0,
        rejectedVariant: 0,
        rejectedRelevance: 0,
        rejectedPriceOutlier: 0,
        rejectedPriceOutlierHigh: 0
      }
    };
  }

  const activeAccessories = getActiveAccessoryKeywords(query);
  const outlierRatio = options.outlierRatio != null ? options.outlierRatio : getPriceOutlierRatio();
  const outlierMaxRatio = options.outlierMaxRatio != null ? options.outlierMaxRatio : getPriceOutlierMaxRatio();
  const allowRefurbished = queryRequestsRefurbished(query);
  const foreignTlds = getForeignTlds();

  // ─── STEP 1: Compute Market Reference Median ──────────────────────────────
  // The reference set includes relevant, non-banned, non-accessory items (even if carrier-locked,
  // foreign store, or variant), as they provide genuine market price context.
  const referenceOffers = offers.filter((o) => isInReferencePriceSet(o, query, activeAccessories));
  const referencePrices = referenceOffers
    .map((o) => Number(o.price))
    .filter((p) => !isNaN(p) && p > 0);

  const referenceMedian = calculateMedian(referencePrices);
  const hasSufficientReference = referencePrices.length >= 5;

  let minAllowedPrice = 0;
  let maxAllowedPrice = 0;
  let isOutlierFilterApplied = false;

  if (hasSufficientReference && referenceMedian > 0) {
    minAllowedPrice = referenceMedian * outlierRatio;
    maxAllowedPrice = referenceMedian * outlierMaxRatio;
    isOutlierFilterApplied = true;
  }

  const filteredOut = [];
  const initialCandidates = [];

  let refurbishedCount = 0;
  let rejectedStore = 0;
  let rejectedForeignStore = 0;
  let rejectedCarrierLocked = 0;
  let rejectedRefurbished = 0;
  let rejectedAccessory = 0;
  let rejectedVariant = 0;
  let rejectedRelevance = 0;
  let rejectedPriceOutlier = 0;
  let rejectedPriceOutlierHigh = 0;

  // ─── STEP 2: Strict Candidate Filtering ────────────────────────────────────
  for (const rawOffer of offers) {
    const offer = { ...rawOffer };

    // Tag condition ("new" | "refurbished")
    const condition = offer.condition || determineCondition(offer.title);
    offer.condition = condition;
    if (condition === 'refurbished') {
      refurbishedCount++;
    }

    // 1. Foreign Store validation (.ae, .sa, .com.sa, etc.)
    const foreignTld = isForeignStore(offer.store, foreignTlds);
    if (foreignTld) {
      rejectedForeignStore++;
      filteredOut.push({ offer, reason: 'FOREIGN_STORE', detail: `Store on foreign TLD "${foreignTld}"` });
      continue;
    }

    // 2. Carrier-locked detection (verizon, cricket, tracfone, etc.)
    const carrierLockedMatch = matchesCarrierLockedKeyword(offer.title, query);
    if (carrierLockedMatch) {
      rejectedCarrierLocked++;
      filteredOut.push({ offer, reason: 'CARRIER_LOCKED', detail: `Carrier-locked phrase "${carrierLockedMatch}"` });
      continue;
    }

    // 3. Banned/Unknown Store name validation
    if (isBannedStore(offer.store)) {
      rejectedStore++;
      filteredOut.push({ offer, reason: 'BANNED_OR_UNKNOWN_STORE', detail: offer.store });
      continue;
    }

    // 4. Accessory keywords check
    const matchedAccessory = matchesAccessoryKeyword(offer.title, activeAccessories);
    if (matchedAccessory) {
      rejectedAccessory++;
      filteredOut.push({ offer, reason: 'ACCESSORY_DETECTED', detail: matchedAccessory });
      continue;
    }

    // 5. Variant matching check (e.g. "iPhone 15" rejects "Plus", "Pro", "Max")
    const variantCheck = checkVariantMatch(offer.title, query);
    if (!variantCheck.isMatch) {
      rejectedVariant++;
      filteredOut.push({ offer, reason: 'VARIANT_MISMATCH', detail: variantCheck.detail });
      continue;
    }

    // 6. Condition filter: Default to "new" only unless query asks for refurbished
    if (condition === 'refurbished' && !allowRefurbished) {
      rejectedRefurbished++;
      filteredOut.push({
        offer,
        reason: 'REFURBISHED_NOT_REQUESTED',
        detail: `Refurbished/renewed item filtered out (not requested in query)`
      });
      continue;
    }

    // 7. Relevance check: Title must contain query main keywords
    if (!matchesQueryRelevance(offer.title, query)) {
      rejectedRelevance++;
      filteredOut.push({ offer, reason: 'IRRELEVANT_TITLE', detail: offer.title });
      continue;
    }

    initialCandidates.push(offer);
  }

  // ─── STEP 3: Outlier Price Filter (Applied on Final Candidates) ───────────
  const passedOffers = [];

  for (const candidate of initialCandidates) {
    const price = Number(candidate.price) || 0;
    if (isOutlierFilterApplied && minAllowedPrice > 0 && price < minAllowedPrice) {
      rejectedPriceOutlier++;
      filteredOut.push({
        offer: candidate,
        reason: 'PRICE_OUTLIER',
        detail: `Price ₹${price} is below ${Math.round(outlierRatio * 100)}% of reference median (₹${Math.round(minAllowedPrice)})`
      });
      continue;
    }

    if (isOutlierFilterApplied && maxAllowedPrice > 0 && price > maxAllowedPrice) {
      rejectedPriceOutlierHigh++;
      filteredOut.push({
        offer: candidate,
        reason: 'PRICE_OUTLIER_HIGH',
        detail: `Price ₹${price} is above ${outlierMaxRatio}x of reference median (₹${Math.round(maxAllowedPrice)})`
      });
      continue;
    }

    passedOffers.push(candidate);
  }

  // ─── STEP 4: Confidence Evaluation ─────────────────────────────────────────
  // Low confidence triggers if:
  // 1. Reference set had fewer than 5 offers, OR
  // 2. Final passed offers are fewer than 3
  const isLowConfidence = !hasSufficientReference || passedOffers.length < 3;
  const confidenceMessage = isLowConfidence ? 'Kam reliable results mile' : null;

  return {
    passedOffers,
    filteredOut,
    lowConfidence: isLowConfidence,
    confidenceMessage,
    stats: {
      total: offers.length,
      passed: passedOffers.length,
      referenceCount: referencePrices.length,
      referenceMedian: Math.round(referenceMedian),
      medianPrice: Math.round(referenceMedian),
      minAllowedPrice: Math.round(minAllowedPrice),
      maxAllowedPrice: Math.round(maxAllowedPrice),
      outlierRatio,
      outlierMaxRatio,
      lowConfidence: isLowConfidence,
      confidenceMessage,
      refurbishedCount,
      rejectedStore,
      rejectedForeignStore,
      rejectedCarrierLocked,
      rejectedRefurbished,
      rejectedAccessory,
      rejectedVariant,
      rejectedRelevance,
      rejectedPriceOutlier,
      rejectedPriceOutlierHigh
    }
  };
}

/**
 * Main export: Filters comparison offers and returns clean offer array
 * @param {Array<Object>} offers
 * @param {string} query
 * @param {Object} [options]
 * @returns {Array<Object>}
 */
export function filterComparisonOffers(offers, query, options = {}) {
  const result = filterComparisonOffersWithReport(offers, query, options);
  return result.passedOffers;
}

export default filterComparisonOffers;
