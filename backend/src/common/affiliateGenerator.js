/**
 * Affiliate Generator Utility
 * Generates official store affiliate tracking links safely using environment variables.
 */

export const generateAffiliateUrl = (storeCode, originalUrl) => {
  if (!originalUrl || typeof originalUrl !== 'string') return '#';

  const store = (storeCode || '').toLowerCase();
  const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'pricelens-21';
  const flipkartTag = process.env.FLIPKART_AFFILIATE_TAG || 'pricelens';

  try {
    const urlObj = new URL(originalUrl);

    if (store === 'amazon' || urlObj.hostname.includes('amazon')) {
      urlObj.searchParams.set('tag', amazonTag);
      return urlObj.toString();
    }

    if (store === 'flipkart' || urlObj.hostname.includes('flipkart')) {
      urlObj.searchParams.set('affid', flipkartTag);
      return urlObj.toString();
    }

    return originalUrl;
  } catch (err) {
    return originalUrl;
  }
};
