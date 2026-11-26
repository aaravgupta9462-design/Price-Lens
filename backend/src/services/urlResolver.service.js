import { comparisonService } from './comparison.service.js';

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

  // Extract Amazon ASIN (/dp/B0..., /gp/product/B0...)
  let asin = null;
  if (store === 'Amazon') {
    const asinMatch = parsed.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
    if (asinMatch) asin = asinMatch[1].toUpperCase();
  }

  // Extract Flipkart PID (?pid=MOB... or /p/itm...)
  let pid = null;
  if (store === 'Flipkart') {
    pid = parsed.searchParams.get('pid') || null;
    if (!pid) {
      const itmMatch = parsed.pathname.match(/\/p\/(itm[a-z0-9]+)/i);
      if (itmMatch) pid = itmMatch[1];
    }
  }

  // Extract human-readable product title from URL path slug
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
  const inferredTitle = (slugTitle || queryParamTitle || (asin ? `Amazon ${asin}` : 'Smartphone')).slice(0, 90);

  return {
    store,
    asin,
    pid,
    inferredTitle,
    canonicalUrl: trimmed,
  };
}

/**
 * Optional Live Fetcher 1: Rainforest API for Amazon ASIN
 */
async function fetchFromRainforest(asin) {
  const apiKey = process.env.RAINFOREST_API_KEY?.trim();
  if (!apiKey || !asin) return null;

  const endpoint = new URL('https://api.rainforestapi.com/request');
  endpoint.searchParams.set('api_key', apiKey);
  endpoint.searchParams.set('type', 'product');
  endpoint.searchParams.set('amazon_domain', 'amazon.in');
  endpoint.searchParams.set('asin', asin);

  const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;

  const data = await res.json();
  const prod = data?.product;
  if (!prod) return null;

  return {
    title: prod.title,
    price: prod.buybox_winner?.price?.value || null,
    originalPrice: prod.buybox_winner?.rrp?.value || null,
    image: prod.main_image?.link || null,
    rating: prod.rating || null,
    source: 'rainforest-api',
  };
}

/**
 * Optional Live Fetcher 2: ScrapingBee HTML metadata extractor for Flipkart / Amazon
 */
async function fetchFromScrapingBee(targetUrl) {
  const apiKey = process.env.SCRAPINGBEE_API_KEY?.trim();
  if (!apiKey) return null;

  const endpoint = new URL('https://app.scrapingbee.com/api/v1/');
  endpoint.searchParams.set('api_key', apiKey);
  endpoint.searchParams.set('url', targetUrl);
  endpoint.searchParams.set('render_js', 'false');

  const res = await fetch(endpoint.toString(), { signal: AbortSignal.timeout(10000) });
  if (!res.ok) return null;

  const html = await res.text();
  const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
    || html.match(/<title>([^<]+)<\/title>/i);
  const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const priceMatch = html.match(/₹\s?([\d,]{3,8})/);

  return {
    title: titleMatch?.[1]?.replace(/\s*[-|:]\s*(Amazon\.in|Flipkart\.com).*$/i, '').trim() || null,
    price: priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : null,
    image: imageMatch?.[1] || null,
    source: 'scrapingbee',
  };
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

    // 1. Try live external APIs if API keys are configured
    let liveMeta = null;
    try {
      if (parsedInfo.store === 'Amazon' && parsedInfo.asin) {
        liveMeta = await fetchFromRainforest(parsedInfo.asin);
      }
      if (!liveMeta) {
        liveMeta = await fetchFromScrapingBee(parsedInfo.canonicalUrl);
      }
    } catch (err) {
      console.warn('[urlResolver] Live scraper/API fetch skipped:', err.message);
    }

    const searchTitle = liveMeta?.title || parsedInfo.inferredTitle;

    // 2. Compare across Amazon & Flipkart via comparisonService
    let comparison = null;
    try {
      comparison = await comparisonService.compareQuery(searchTitle, { bypassCache });
    } catch (err) {
      console.warn('[urlResolver] comparisonService lookup fallback:', err.message);
    }

    const payload = {
      url: parsedInfo.canonicalUrl,
      store: parsedInfo.store,
      asin: parsedInfo.asin,
      pid: parsedInfo.pid,
      productName: searchTitle,
      liveMetadata: liveMeta,
      comparison,
      resolvedAt: new Date().toISOString(),
      cached: false,
    };

    urlCache.set(cacheKey, { timestamp: Date.now(), payload });
    return payload;
  },
};

export default urlResolverService;
