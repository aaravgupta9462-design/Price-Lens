/**
 * Product Normalizer Utility
 * Converts third-party store API data into the standard PriceLens product schema.
 */

export const normalizeProduct = (rawData = {}) => {
  const price = Number(rawData.price || rawData.currentPrice || 0);
  const mrp = Number(rawData.mrp || rawData.originalPrice || price);
  const discountPct = mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : Number(rawData.discount || 0);

  return {
    store: rawData.store || 'Unknown Retailer',
    storeCode: (rawData.storeCode || rawData.store || 'unknown').toLowerCase().replace(/\s+/g, ''),
    productId: rawData.productId || rawData.externalId || rawData.id || `PROD_${Date.now()}`,
    title: rawData.title || rawData.name || 'Product Title',
    brand: rawData.brand || extractBrand(rawData.title || rawData.name || ''),
    model: rawData.model || extractModel(rawData.title || rawData.name || ''),
    variant: rawData.variant || extractVariant(rawData.title || rawData.name || ''),
    storage: rawData.storage || extractStorage(rawData.title || rawData.name || ''),
    ram: rawData.ram || extractRam(rawData.title || rawData.name || ''),
    color: rawData.color || extractColor(rawData.title || rawData.name || ''),
    image: rawData.image || rawData.imageUrl || rawData.emoji || '🛍️',
    price: price,
    mrp: mrp,
    discount: discountPct,
    currency: rawData.currency || 'INR',
    availability: rawData.availability !== undefined ? Boolean(rawData.availability) : true,
    stockStatus: rawData.stockStatus || (rawData.availability ? 'In Stock' : 'Out of Stock'),
    rating: Number(rawData.rating || 4.2),
    reviewCount: Number(rawData.reviewCount || 100),
    url: rawData.url || rawData.productUrl || '#',
    affiliateUrl: rawData.affiliateUrl || rawData.url || '#',
    lastUpdated: rawData.lastUpdated || new Date().toISOString()
  };
};

const extractBrand = (text) => {
  const brands = ['Apple', 'Samsung', 'Sony', 'OnePlus', 'Dell', 'HP', 'Lenovo', 'Asus', 'LG', 'Xiaomi', 'Bose', 'Sennheiser', 'Boat'];
  const found = brands.find((b) => new RegExp(`\\b${b}\\b`, 'i').test(text));
  return found || 'Generic';
};

const extractModel = (text) => {
  const match = text.match(/(iphone\s+\d+\s*(pro\s*max|pro|plus)?|galaxy\s+s\d+\s*(ultra|plus)?|macbook\s*(air|pro)?\s*m\d+|wh-1000xm\d+)/i);
  return match ? match[0] : '';
};

const extractVariant = (text) => {
  const storageMatch = text.match(/(\d+\s*(gb|tb))/i);
  const colorMatch = text.match(/\b(black|white|blue|green|red|silver|gold|grey|titanium)\b/i);
  const parts = [];
  if (storageMatch) parts.push(storageMatch[0]);
  if (colorMatch) parts.push(colorMatch[0]);
  return parts.join(' ') || 'Standard';
};

const extractStorage = (text) => {
  const match = text.match(/(\d+\s*(gb|tb))\b/i);
  return match ? match[1].toUpperCase() : null;
};

const extractRam = (text) => {
  const match = text.match(/(\d+\s*gb)\s*(ram|memory)\b/i);
  return match ? match[1].toUpperCase() : null;
};

const extractColor = (text) => {
  const match = text.match(/\b(black|white|blue|green|red|silver|gold|space grey|natural titanium)\b/i);
  return match ? match[1] : null;
};
