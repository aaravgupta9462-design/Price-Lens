/**
 * Store Detector Utility
 * Analyzes input string / URL and detects the target store & product ID.
 */

export const SUPPORTED_STORES = [
  {
    code: 'amazon',
    name: 'Amazon India',
    domains: ['amazon.in', 'amazon.com', 'amzn.in', 'amzn.to'],
    emoji: '📦',
    color: '#FF9900',
    extractId: (url) => {
      const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i) || url.match(/\/([A-Z0-9]{10})(?:[/?%]|$)/i);
      return match ? match[1] : null;
    }
  },
  {
    code: 'flipkart',
    name: 'Flipkart',
    domains: ['flipkart.com', 'fkrt.it'],
    emoji: '🛒',
    color: '#2874F0',
    extractId: (url) => {
      const match = url.match(/pid=([A-Z0-9]{16})/i) || url.match(/\/p\/([a-z0-9]+)/i);
      return match ? match[1] : null;
    }
  },
  {
    code: 'croma',
    name: 'Croma',
    domains: ['croma.com'],
    emoji: '🟢',
    color: '#00E9BF',
    extractId: (url) => {
      const match = url.match(/\/p\/(\d+)/i) || url.match(/-p-(\d+)/i);
      return match ? match[1] : null;
    }
  },
  {
    code: 'reliance',
    name: 'Reliance Digital',
    domains: ['reliancedigital.in'],
    emoji: '🔴',
    color: '#E4252A',
    extractId: (url) => {
      const match = url.match(/\/p\/(\d+)/i) || url.match(/(\d{9})/);
      return match ? match[1] : null;
    }
  },
  {
    code: 'myntra',
    name: 'Myntra',
    domains: ['myntra.com'],
    emoji: '🛍️',
    color: '#FF3F6C',
    extractId: (url) => {
      const match = url.match(/\/(\d+)\/buy/i) || url.match(/\/(\d{6,10})/);
      return match ? match[1] : null;
    }
  },
  {
    code: 'tatacliq',
    name: 'Tata CLiQ',
    domains: ['tatacliq.com'],
    emoji: '💎',
    color: '#A21D5A',
    extractId: (url) => {
      const match = url.match(/\/p-mp(\d+)/i) || url.match(/\/p-([a-z0-9]+)/i);
      return match ? match[1] : null;
    }
  },
  {
    code: 'vijaysales',
    name: 'Vijay Sales',
    domains: ['vijaysales.com'],
    emoji: '⚡',
    color: '#D32F2F',
    extractId: (url) => {
      const match = url.match(/\/product\/(\d+)/i) || url.match(/-p-(\d+)/i);
      return match ? match[1] : null;
    }
  }
];

export const detectStoreFromUrl = (inputUrl) => {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const cleanUrl = inputUrl.trim().toLowerCase();

  for (const store of SUPPORTED_STORES) {
    if (store.domains.some((domain) => cleanUrl.includes(domain))) {
      const externalId = store.extractId(inputUrl);
      return {
        storeCode: store.code,
        storeName: store.name,
        emoji: store.emoji,
        color: store.color,
        externalId: externalId || 'URL_MATCH',
        rawUrl: inputUrl
      };
    }
  }

  return null;
};
