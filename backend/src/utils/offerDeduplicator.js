/**
 * Offer Deduplication & Priority Merge Utility
 * 
 * Handles intelligent merging between Direct Retailer API offers (Amazon Creators, Flipkart Affiliate)
 * and Aggregator offers (SerpApi Google Shopping).
 * 
 * Rules:
 * 1. If an offer comes from a Direct API and another from an Aggregator for the same store and similar title:
 *    the Direct API offer is prioritized and the Aggregator duplicate is removed.
 * 2. Cross-store offers and distinctly different models within the same store are preserved.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'by', 'for', 'with', 'and', 'or', 'to',
  'of', 'is', 'buy', 'online', 'india', 'best', 'price', 'new', 'latest',
  'free', 'shipping', 'delivery', 'deal', 'deals', 'offer', 'offers'
]);

/**
 * Normalizes a store name or slug to a unified key
 * @param {string} storeSlug
 * @param {string} storeName
 * @returns {string}
 */
export function normalizeStoreKey(storeSlug, storeName) {
  const raw = `${storeSlug || ''} ${storeName || ''}`.toLowerCase();
  if (raw.includes('amazon')) return 'amazon';
  if (raw.includes('flipkart')) return 'flipkart';
  if (raw.includes('croma')) return 'croma';
  if (raw.includes('reliance')) return 'reliance-digital';
  if (raw.includes('tatacliq') || raw.includes('tata cliq')) return 'tatacliq';
  if (raw.includes('vijay')) return 'vijay-sales';
  
  return String(storeSlug || storeName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Checks whether two offers belong to the same merchant/store
 * @param {Object} offerA
 * @param {Object} offerB
 * @returns {boolean}
 */
export function isSameStore(offerA, offerB) {
  if (!offerA || !offerB) return false;
  const storeA = normalizeStoreKey(offerA.storeSlug, offerA.store);
  const storeB = normalizeStoreKey(offerB.storeSlug, offerB.store);
  return Boolean(storeA && storeB && storeA === storeB);
}

/**
 * Normalizes title text by collapsing storage/ram suffixes (e.g. "128 gb" -> "128gb")
 * and stripping non-alphanumeric punctuation.
 * @param {string} title
 * @returns {string}
 */
export function normalizeTitleText(title) {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .replace(/(\d+)\s*(gb|tb|mb|g|ram|rom)\b/gi, '$1$2')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize a product title into normalized semantic words
 * @param {string} title
 * @returns {Set<string>}
 */
export function tokenizeTitle(title) {
  const normalized = normalizeTitleText(title);
  if (!normalized) return new Set();
  const words = normalized
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Extract standalone numeric and alphanumeric model codes (e.g. "16", "15", "s25", "xm5", "m3")
 * @param {string} title
 * @returns {{ numbers: Set<string>, alphanumeric: Set<string> }}
 */
export function extractModelIdentifiers(title) {
  const normalized = normalizeTitleText(title);
  const words = normalized.split(/\s+/);
  const numbers = new Set();
  const alphanumeric = new Set();

  for (const w of words) {
    if (/^\d{1,4}$/.test(w)) {
      numbers.add(w);
    } else if (/\d/.test(w) && /[a-z]/i.test(w) && w.length >= 2 && !w.endsWith('gb') && !w.endsWith('tb')) {
      alphanumeric.add(w);
    }
  }

  return { numbers, alphanumeric };
}

/**
 * Check if two titles represent the same product offer
 * @param {string} titleA
 * @param {string} titleB
 * @param {number} [threshold=0.5]
 * @returns {boolean}
 */
export function areTitlesSimilar(titleA, titleB, threshold = 0.5) {
  if (!titleA || !titleB) return false;

  const normA = normalizeTitleText(titleA);
  const normB = normalizeTitleText(titleB);

  // Exact match
  if (normA === normB) return true;

  // Check standalone model generation numbers (e.g., "16" vs "15", "25" vs "24")
  const idA = extractModelIdentifiers(titleA);
  const idB = extractModelIdentifiers(titleB);

  // If both have standalone numbers, they must share at least one common number
  if (idA.numbers.size > 0 && idB.numbers.size > 0) {
    let hasCommonNumber = false;
    for (const num of idA.numbers) {
      if (idB.numbers.has(num)) {
        hasCommonNumber = true;
        break;
      }
    }
    if (!hasCommonNumber) {
      // Conflicting model numbers (e.g. iPhone 16 vs iPhone 15)
      return false;
    }
  }

  // If both have alphanumeric model codes (e.g. "s25" vs "s24", "xm5" vs "xm4"), check conflict
  if (idA.alphanumeric.size > 0 && idB.alphanumeric.size > 0) {
    let hasCommonAlpha = false;
    for (const code of idA.alphanumeric) {
      if (idB.alphanumeric.has(code)) {
        hasCommonAlpha = true;
        break;
      }
    }
    if (!hasCommonAlpha) {
      return false;
    }
  }

  const tokensA = tokenizeTitle(titleA);
  const tokensB = tokenizeTitle(titleB);

  if (tokensA.size === 0 || tokensB.size === 0) return false;

  // Intersection
  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }

  const minSize = Math.min(tokensA.size, tokensB.size);
  const overlapRatio = intersectionCount / minSize;

  const unionSize = tokensA.size + tokensB.size - intersectionCount;
  const jaccardRatio = unionSize > 0 ? intersectionCount / unionSize : 0;

  return overlapRatio >= 0.55 || jaccardRatio >= 0.4;
}

/**
 * Merge offers from Direct APIs and Aggregators (SerpApi), removing duplicates
 * and strictly prioritizing Direct API results.
 * 
 * @param {Array<Object>} offers - Array of normalized offers
 * @returns {Array<Object>} Merged offers with direct API priority
 */
export function mergeAndDeduplicateOffers(offers) {
  if (!Array.isArray(offers) || offers.length <= 1) {
    return offers || [];
  }

  const directOffers = [];
  const aggregatorOffers = [];

  for (const offer of offers) {
    if (offer.isDirectApi || offer.isDirect) {
      directOffers.push(offer);
    } else {
      aggregatorOffers.push(offer);
    }
  }

  // If there are no direct offers, keep all offers as-is
  if (directOffers.length === 0) {
    return offers;
  }

  // Filter out aggregator offers that duplicate any direct API offer
  const keptAggregatorOffers = aggregatorOffers.filter((aggOffer) => {
    const isDuplicateOfDirect = directOffers.some((directOffer) => {
      if (!isSameStore(directOffer, aggOffer)) {
        return false;
      }
      return areTitlesSimilar(directOffer.title, aggOffer.title);
    });

    return !isDuplicateOfDirect;
  });

  return [...directOffers, ...keptAggregatorOffers];
}

export default {
  normalizeStoreKey,
  isSameStore,
  normalizeTitleText,
  tokenizeTitle,
  extractModelIdentifiers,
  areTitlesSimilar,
  mergeAndDeduplicateOffers
};
