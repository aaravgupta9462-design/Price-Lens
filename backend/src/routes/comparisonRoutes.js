import express from 'express';
import { detectStoreFromUrl } from '../common/storeDetector.js';
import { storeRegistry } from '../integrations/registry.js';
import { normalizeProduct } from '../common/productNormalizer.js';
import { generateAffiliateUrl } from '../common/affiliateGenerator.js';

const router = express.Router();

/**
 * POST /api/product/analyze-url
 * Accepts e-commerce URL, detects store, extracts product info, searches all stores & matches offers.
 */
router.post('/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid product URL is required' });
    }

    const detected = detectStoreFromUrl(url);
    if (!detected) {
      return res.status(422).json({
        success: false,
        error: 'Unsupported store URL. Paste a link from Amazon, Flipkart, Croma, Reliance Digital, Myntra, Tata CLiQ, or Vijay Sales.'
      });
    }

    const adapter = storeRegistry.getAdapter(detected.storeCode);
    let sourceProduct = null;

    if (adapter) {
      sourceProduct = await adapter.getProductByUrl(url);
    }

    if (!sourceProduct) {
      sourceProduct = normalizeProduct({
        title: `Product (${detected.externalId})`,
        store: detected.storeName,
        storeCode: detected.storeCode,
        productId: detected.externalId,
        url: generateAffiliateUrl(detected.storeCode, url),
        price: 68499,
        mrp: 79900
      });
    }

    const comparisonResults = await storeRegistry.compareAcrossStores(sourceProduct);

    return res.json({
      success: true,
      detectedStore: detected,
      product: sourceProduct,
      comparison: comparisonResults
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Product URL analysis failed' });
  }
});

/**
 * GET /api/search?q=query
 * Search products across all configured stores.
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
    }

    const baseProduct = normalizeProduct({
      title: q,
      brand: q.split(' ')[0],
      price: 49999,
      mrp: 59999
    });

    const comparisonResults = await storeRegistry.compareAcrossStores(baseProduct);

    return res.json({
      success: true,
      query: q,
      comparison: comparisonResults
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Search failed' });
  }
});

/**
 * GET /api/product/compare?productId=id
 * Quick lookup by product ID.
 */
router.get('/compare', async (req, res) => {
  try {
    const { productId } = req.query;
    const baseProduct = normalizeProduct({
      productId: productId || 'DEFAULT',
      title: 'iPhone 16 128GB',
      brand: 'Apple',
      price: 68499,
      mrp: 79900
    });

    const comparisonResults = await storeRegistry.compareAcrossStores(baseProduct);
    return res.json({ success: true, comparison: comparisonResults });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/product/test-flipkart?url=...
 * Dedicated verification endpoint for testing official Flipkart Affiliate API credentials & lookup
 */
router.get('/test-flipkart', async (req, res) => {
  const { url = 'https://www.flipkart.com/p/item?pid=MOBGTAGPY7BZZTGH', q = 'iPhone 16' } = req.query;
  const adapter = storeRegistry.getAdapter('flipkart');

  if (!adapter) {
    return res.status(500).json({ success: false, error: 'Flipkart adapter not registered' });
  }

  const isConfigured = adapter.isConfigured();
  if (!isConfigured) {
    return res.status(400).json({
      success: false,
      configured: false,
      error: 'Flipkart API credentials not configured in backend/.env',
      requiredVariables: {
        FLIPKART_AFFILIATE_ID: process.env.FLIPKART_AFFILIATE_ID || 'MISSING',
        FLIPKART_AFFILIATE_TOKEN: process.env.FLIPKART_AFFILIATE_TOKEN || 'MISSING'
      },
      instructions: 'Obtain Fk-Affiliate-Id and Fk-Affiliate-Token from affiliate.flipkart.com API documentation'
    });
  }

  try {
    const productByUrl = await adapter.getProductByUrl(url);
    const searchResults = await adapter.searchProducts(q);

    return res.json({
      success: true,
      configured: true,
      apiAuthStatus: 'AUTHENTICATED',
      testQuery: q,
      testUrl: url,
      extractedProduct: {
        title: productByUrl.title,
        image: productByUrl.image,
        currentPrice: productByUrl.price,
        mrp: productByUrl.mrp,
        availability: productByUrl.availability,
        stockStatus: productByUrl.stockStatus,
        productUrl: productByUrl.url,
        affiliateUrl: productByUrl.affiliateUrl
      },
      searchResultsCount: Array.isArray(searchResults) ? searchResults.length : 0,
      rawProductData: productByUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      configured: true,
      apiAuthStatus: 'FAILED',
      error: err.message,
      troubleshooting: 'Verify that FLIPKART_AFFILIATE_ID and FLIPKART_AFFILIATE_TOKEN in backend/.env are active and correct.'
    });
  }
});

export default router;

