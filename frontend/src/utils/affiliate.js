/**
 * PriceLens Affiliate Tracking URL Generator
 * Automatically injects approved affiliate tracking parameters for Amazon, Flipkart, Croma, etc.
 */

const AMAZON_TAG = import.meta.env.VITE_AMAZON_TAG || 'pricelens-21';
const FLIPKART_TAG = import.meta.env.VITE_FLIPKART_TAG || 'pricelens';

export const getAffiliateUrl = (url, storeName = '') => {
  if (!url || typeof url !== 'string' || url === '#') {
    return '#';
  }

  const s = (storeName || '').toLowerCase();

  try {
    const urlObj = new URL(url);

    // Amazon
    if (s.includes('amazon') || urlObj.hostname.includes('amazon.')) {
      urlObj.searchParams.set('tag', AMAZON_TAG);
      return urlObj.toString();
    }

    // Flipkart
    if (s.includes('flipkart') || urlObj.hostname.includes('flipkart.')) {
      urlObj.searchParams.set('affid', FLIPKART_TAG);
      return urlObj.toString();
    }

    return url;
  } catch (err) {
    // Return original url if malformed or relative
    return url;
  }
};
