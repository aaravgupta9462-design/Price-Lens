const urlCache = new Map();
const CACHE_TTL_MS = (Number(process.env.CACHE_TTL_SECONDS) || 3600) * 1000;

/**
 * Extract store, ASIN/PID, and clean search title from an Amazon or Flipkart URL.
 */
export function parseStoreUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  const parsed = new URL(trimmed);
  const host = parsed.hostname.toLowerCase();

  let store = null;
  if (host.includes('amazon.') || host.includes('amzn.')) {
    store = 'Amazon';
  } else if (host.includes('flipkart.') || host.includes('fkrt.')) {
    store = 'Flipkart';
  }

  if (!store) {
    throw new Error('Only Amazon (amazon.in) and Flipkart (flipkart.com) product URLs are currently supported.');
  }

  let asin = null;
  if (store === 'Amazon') {
    const asinMatch = parsed.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
    if (asinMatch) asin = asinMatch[1].toUpperCase();
  }

  let pid = null;
  if (store === 'Flipkart') {
    pid = parsed.searchParams.get('pid') || null;
    if (!pid) {
      const itmMatch = parsed.pathname.match(/\/p\/(itm[a-z0-9]+)/i);
      if (itmMatch) pid = itmMatch[1];
    }
  }

  const segments = parsed.pathname
    .split('/')
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 3 &&
        !/^(dp|gp|product|p|s|itm[a-z0-9]+|[A-Z0-9]{10})$/i.test(s)
    );

  const rawSlug = segments[0] || '';
  const slugTitle = decodeURIComponent(rawSlug)
    .replace(/[-_+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const queryParamTitle = parsed.searchParams.get('k') || parsed.searchParams.get('q') || '';
  const inferredTitle = (slugTitle || queryParamTitle || (asin ? `Amazon ${asin}` : 'Product')).slice(0, 90);

  return {
    store,
    asin,
    pid,
    inferredTitle,
    canonicalUrl: trimmed,
  };
}

/**
 * Fast Amazon ASIN lookup via Rainforest API (6s timeout)
 */
async function fetchFromRainforest(asin) {
  const apiKey = process.env.RAINFOREST_API_KEY?.trim();
  if (!apiKey || !asin) return null;

  try {
    const endpoint = new URL('https://api.rainforestapi.com/request');
    endpoint.searchParams.set('api_key', apiKey);
    endpoint.searchParams.set('type', 'product');
    endpoint.searchParams.set('amazon_domain', 'amazon.in');
    endpoint.searchParams.set('asin', asin);

    const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(6500) });
    if (!res.ok) return null;

    const data = await res.json();
    const prod = data?.product;
    if (!prod) return null;

    const price =
      prod.buybox_winner?.price?.value ||
      prod.price?.value ||
      prod.variants?.[0]?.price?.value ||
      null;

    return {
      title: prod.title,
      price,
      originalPrice: prod.buybox_winner?.rrp?.value || prod.list_price?.value || null,
      image: prod.main_image?.link || null,
      rating: prod.rating || null,
      source: 'rainforest-api',
    };
  } catch {
    return null;
  }
}

/**
 * ScrapingBee structured metadata extractor for Flipkart / Amazon (6.5s timeout)
 */
async function fetchFromScrapingBee(targetUrl, store) {
  const apiKey = process.env.SCRAPINGBEE_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const endpoint = new URL('https://app.scrapingbee.com/api/v1/');
    endpoint.searchParams.set('api_key', apiKey);
    endpoint.searchParams.set('url', targetUrl);
    endpoint.searchParams.set('render_js', 'false');

    const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(6500) });
    if (!res.ok) return null;

    const html = await res.text();
    const titleMatch =
      html.match(/id=["']productTitle["'][^>]*>\s*([^<]+?)\s*</i) ||
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<title>([^<]+)<\/title>/i);
    const imageMatch =
      html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/i) ||
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

    let extractedPrice = null;
    if (store === 'Amazon') {
      const amzPriceMatch =
        html.match(/class=["'][^"']*priceToPay[^"']*["'][\s\S]{0,300}?class=["']a-price-whole["'][^>]*>([\d,]+)/i) ||
        html.match(/"priceAmount"\s*:\s*([\d.]+)/i) ||
        html.match(/id=["']priceblock_ourprice["'][^>]*>\s*₹?\s*([\d,]+)/i) ||
        html.match(/id=["']priceblock_dealprice["'][^>]*>\s*₹?\s*([\d,]+)/i) ||
        html.match(/class=["']a-price-whole["'][^>]*>([\d,]+)/i);
      if (amzPriceMatch) {
        extractedPrice = Math.round(Number(amzPriceMatch[1].replace(/,/g, '')));
      }
    } else if (store === 'Flipkart') {
      const fkPriceMatch =
        html.match(/"@type"\s*:\s*"Product"[\s\S]{0,2000}?"price"\s*:\s*"?(\d+)"?/i) ||
        html.match(/class=["'][^"']*Nx9bqj[^"']*CxhGGd[^"']*["'][^>]*>₹([\d,]+)/i) ||
        html.match(/<meta\s+property=["']product:price:amount["']\s+content=["']([\d.]+)["']/i) ||
        html.match(/"finalPrice"\s*:\s*\{\s*"value"\s*:\s*(\d+)/i);
      if (fkPriceMatch) {
        extractedPrice = Math.round(Number(fkPriceMatch[1].replace(/,/g, '')));
      }
    }

    const cleanTitle = titleMatch?.[1]
      ?.replace(/\s*Online at Best Price.*$/i, '')
      ?.replace(/\s*[-|:]\s*(Amazon\.in|Flipkart\.com).*$/i, '')
      .trim() || null;

    return {
      title: cleanTitle,
      price: extractedPrice && extractedPrice > 0 ? extractedPrice : null,
      image: imageMatch?.[1] || null,
      source: 'scrapingbee',
    };
  } catch {
    return null;
  }
}

/**
 * Find exact direct product page URL (flipkart.com/.../p/... or amazon.in/.../dp/...)
 * via SerpApi Google Organic search (5s timeout).
 */
async function fetchDirectProductUrl(storeName, query) {
  const apiKey = process.env.SERPAPI_KEY?.trim();
  if (!apiKey || !query) return null;

  try {
    const siteFilter = storeName === 'Flipkart' ? 'site:flipkart.com' : 'site:amazon.in';
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const shortQuery = cleanQuery.split(/\s+/).slice(0, 9).join(' ');
    const endpoint = new URL('https://serpapi.com/search.json');
    endpoint.searchParams.set('engine', 'google');
    endpoint.searchParams.set('q', `${siteFilter} ${shortQuery}`);
    endpoint.searchParams.set('gl', 'in');
    endpoint.searchParams.set('hl', 'en');
    endpoint.searchParams.set('num', '5');
    endpoint.searchParams.set('api_key', apiKey);

    const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = await res.json();
    const organic = data?.organic_results || [];

    const directHit = organic.find((r) => {
      const link = (r.link || '').toLowerCase();
      if (storeName === 'Flipkart') {
        return link.includes('flipkart.com/') && link.includes('/p/');
      }
      return link.includes('amazon.in/') && (link.includes('/dp/') || link.includes('/gp/product/'));
    });

    return directHit?.link || null;
  } catch {
    return null;
  }
}

/**
 * Parallel SerpApi Google Shopping lookup filtered for Amazon & Flipkart,
 * matching title keywords + filtering out accessory outliers.
 */
async function fetchSerpApiStoreOffers(query, referencePrice = null, pastedStore = null) {
  const apiKey = process.env.SERPAPI_KEY?.trim();
  if (!apiKey || !query) return { amazon: null, flipkart: null };

  try {
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const shortQuery = cleanQuery.split(/\s+/).slice(0, 9).join(' ');
    const queryWords = shortQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const endpoint = new URL('https://serpapi.com/search.json');
    endpoint.searchParams.set('engine', 'google_shopping');
    endpoint.searchParams.set('q', shortQuery);
    endpoint.searchParams.set('gl', 'in');
    endpoint.searchParams.set('hl', 'en');
    endpoint.searchParams.set('api_key', apiKey);

    // Run Google Shopping + direct opposite-store Organic URL lookup in parallel!
    const oppositeStore = pastedStore === 'Amazon' ? 'Flipkart' : pastedStore === 'Flipkart' ? 'Amazon' : null;
    const [shoppingRes, directOppUrl] = await Promise.all([
      fetch(endpoint.toString(), { signal: AbortSignal.timeout(5500) }),
      oppositeStore ? fetchDirectProductUrl(oppositeStore, shortQuery) : Promise.resolve(null),
    ]);

    if (!shoppingRes.ok) {
      return {
        amazon: null,
        flipkart: directOppUrl && oppositeStore === 'Flipkart'
          ? { store: 'Flipkart', title: shortQuery, price: null, url: directOppUrl, source: 'serpapi-organic' }
          : null,
      };
    }

    const data = await shoppingRes.json();
    const results = data?.shopping_results || [];

    const extractPrice = (item) =>
      item?.extracted_price || Number(String(item?.price || '').replace(/[^\d.]/g, '')) || null;

    const scoreRelevance = (item) => {
      const titleLower = (item.title || '').toLowerCase();
      return queryWords.reduce((acc, w) => (titleLower.includes(w) ? acc + 1 : acc), 0);
    };

    const queryLower = shortQuery.toLowerCase();
    const isAccessoryQuery = /\b(case|cover|tempered|guard|protector|cable|charger|skin|pouch)\b/.test(queryLower);
    const isHighTicket = /\b(iphone|macbook|ipad|laptop|galaxy s|oled|ps5|playstation)\b/.test(queryLower);
    const safeRefPrice = isHighTicket && referencePrice && referencePrice < 8000 ? null : referencePrice;

    const validResults = results.filter((item) => {
      const p = extractPrice(item);
      if (!p || p <= 0) return false;
      const titleLower = (item.title || '').toLowerCase();
      if (!isAccessoryQuery && /\b(case|back cover|cover for|tempered|screen guard|protector|skin|pouch)\b/.test(titleLower)) {
        return false;
      }
      if (isHighTicket && p < 10000) return false;
      if (safeRefPrice && safeRefPrice > 500) {
        if (p < safeRefPrice * 0.45 || p > safeRefPrice * 2.2) return false;
      }
      if (queryWords.length >= 2 && scoreRelevance(item) < 1) return false;
      return true;
    });

    const pool = validResults.length > 0 ? validResults : results;
    // Sort by relevance first, then lowest price
    const sorted = [...pool].sort((a, b) => {
      const relDiff = scoreRelevance(b) - scoreRelevance(a);
      if (relDiff !== 0) return relDiff;
      return (extractPrice(a) || Infinity) - (extractPrice(b) || Infinity);
    });

    const amzItem = sorted.find((r) => (r.source || '').toLowerCase().includes('amazon'));
    const fkItem =
      sorted.find((r) => {
        const src = (r.source || '').toLowerCase();
        return src === 'flipkart' || (src.includes('flipkart') && !src.includes('shopsy'));
      }) || sorted.find((r) => (r.source || '').toLowerCase().includes('flipkart'));

    const ensureDirectStoreUrl = (candidateUrl, directUrl, storeName, fallbackTitle) => {
      for (const u of [candidateUrl, directUrl]) {
        if (u && typeof u === 'string') {
          const lower = u.toLowerCase();
          if (storeName === 'Amazon' && (lower.includes('amazon.in') || lower.includes('amzn.in'))) return u;
          if (storeName === 'Flipkart' && lower.includes('flipkart.com')) return u;
        }
      }
      const q = encodeURIComponent(fallbackTitle || shortQuery);
      return storeName === 'Amazon'
        ? `https://www.amazon.in/s?k=${q}`
        : `https://www.flipkart.com/search?q=${q}`;
    };

    const parseItem = (item, directUrl, storeName) => ({
      store: storeName,
      title: item.title,
      price: extractPrice(item),
      url: ensureDirectStoreUrl(item.link || item.product_link, directUrl, storeName, item.title || shortQuery),
      imageUrl: item.thumbnail || null,
      rating: item.rating || 4.4,
      source: 'serpapi',
    });

    return {
      amazon: amzItem
        ? parseItem(amzItem, oppositeStore === 'Amazon' ? directOppUrl : null, 'Amazon')
        : null,
      flipkart: fkItem
        ? parseItem(fkItem, oppositeStore === 'Flipkart' ? directOppUrl : null, 'Flipkart')
        : directOppUrl && oppositeStore === 'Flipkart'
          ? { store: 'Flipkart', title: shortQuery, price: null, url: directOppUrl, source: 'serpapi-organic' }
          : null,
    };
  } catch {
    return { amazon: null, flipkart: null };
  }
}

export const urlResolverService = {
  async resolveUrl(rawUrl, { bypassCache = false } = {}) {
    const parsedInfo = parseStoreUrl(rawUrl);
    const cacheKey = `${parsedInfo.store}:${parsedInfo.asin || parsedInfo.pid || parsedInfo.canonicalUrl}`;

    if (!bypassCache && urlCache.has(cacheKey)) {
      const cached = urlCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return { ...cached.payload, cached: true };
      }
      urlCache.delete(cacheKey);
    }

    // Step 1: Fetch exact pasted product metadata (fast 6.5s timeout)
    let liveMeta = null;
    if (parsedInfo.store === 'Amazon' && parsedInfo.asin) {
      liveMeta = await fetchFromRainforest(parsedInfo.asin);
    }
    if (!liveMeta || !liveMeta.price) {
      const sbMeta = await fetchFromScrapingBee(parsedInfo.canonicalUrl, parsedInfo.store);
      if (sbMeta) {
        liveMeta = {
          ...liveMeta,
          ...sbMeta,
          title: liveMeta?.title || sbMeta.title,
          price: liveMeta?.price || sbMeta.price,
          image: liveMeta?.image || sbMeta.image,
        };
      }
    }

    const searchTitle = liveMeta?.title || parsedInfo.inferredTitle;

    // Step 2: Single parallel SerpApi call for Amazon & Flipkart offers + direct opposite store URL
    const serpOffers = await fetchSerpApiStoreOffers(searchTitle, liveMeta?.price || null, parsedInfo.store);

    const amazonOffer =
      (parsedInfo.store === 'Amazon' && liveMeta?.price
        ? {
            store: 'Amazon',
            title: liveMeta.title || searchTitle,
            price: liveMeta.price,
            originalPrice: liveMeta.originalPrice || Math.round(liveMeta.price * 1.15),
            url: parsedInfo.canonicalUrl,
            imageUrl: liveMeta.image || null,
            rating: liveMeta.rating || 4.5,
            source: liveMeta.source,
          }
        : null) ||
      serpOffers.amazon ||
      null;

    const flipkartOffer =
      (parsedInfo.store === 'Flipkart' && liveMeta?.price
        ? {
            store: 'Flipkart',
            title: liveMeta.title || searchTitle,
            price: liveMeta.price,
            originalPrice: liveMeta.originalPrice || Math.round(liveMeta.price * 1.15),
            url: parsedInfo.canonicalUrl,
            imageUrl: liveMeta.image || null,
            rating: liveMeta.rating || 4.4,
            source: liveMeta.source,
          }
        : null) ||
      serpOffers.flipkart ||
      null;

    const payload = {
      url: parsedInfo.canonicalUrl,
      store: parsedInfo.store,
      asin: parsedInfo.asin,
      pid: parsedInfo.pid,
      productName: searchTitle,
      liveMetadata: liveMeta,
      amazonOffer,
      flipkartOffer,
      resolvedAt: new Date().toISOString(),
      cached: false,
    };

    urlCache.set(cacheKey, { timestamp: Date.now(), payload });
    return payload;
  },
};

export default urlResolverService;
