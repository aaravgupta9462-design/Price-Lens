import { BaseStoreAdapter } from './BaseStoreAdapter.js';

export class RelianceDigitalAdapter extends BaseStoreAdapter {
  constructor() {
    const isLiveConfigured = Boolean(process.env.RELIANCE_DIGITAL_API_KEY);

    super('Reliance Digital', 'reliance-digital', {
      emoji: '🔵',
      isDevelopmentProvider: !isLiveConfigured
    });
  }

  async search(query) {
    const q = query.toLowerCase().trim();
    return this.getDevelopmentOffers(q);
  }

  async getProductOffer(productId) {
    const offers = await this.search(productId);
    return offers.length > 0 ? offers[0] : null;
  }

  getDevelopmentOffers(q) {
    const now = new Date().toISOString();
    const catalog = [
      {
        matchKeys: ['iphone', '16', 'apple', 'mobile', 'phone'],
        raw: {
          title: 'Apple iPhone 16 128 GB (Black)',
          price: 72900,
          originalPrice: 79999,
          productUrl: 'https://www.reliancedigital.in/apple-iphone-16-128-gb-black/p/494421111',
          imageUrl: 'https://www.reliancedigital.in/medias/iPhone-16-128GB-Black-494421111-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyMTMwMDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY5L2gzZS8xMDIyNDI3ODczODk3NC5qcGd8N2E2ZTUyN2FiYjU2ZWYzYzdlZDJkMWM5MDFhYjA1NTkxNjc1MTQxNjQwOWI1ZjRhMmExYzA1MGFmYmU4YjAwYg',
          availability: 'In Stock',
          delivery: 'Insta Delivery in 24 Hours or Store Pickup',
          rating: 4.4,
          reviewCount: 2400,
          bankOffer: 'Instant ₹4,000 off on OneCard & SBI credit cards',
          couponCode: 'REL1000',
          fetchedAt: now
        }
      },
      {
        matchKeys: ['samsung', 's25', 'galaxy', 'ultra'],
        raw: {
          title: 'Samsung Galaxy S25 5G 256 GB (Phantom Navy)',
          price: 74499,
          originalPrice: 84999,
          productUrl: 'https://www.reliancedigital.in/samsung-galaxy-s25-256-gb/p/494432100',
          imageUrl: 'https://www.reliancedigital.in/medias/Samsung-S25-494432100-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyMTMwMDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY5L2gzZS8xMDIyNDI3ODczODk3NC5qcGd8N2E2ZTUyN2FiYjU2ZWYzYzdlZDJkMWM5MDFhYjA1NTkxNjc1MTQxNjQwOWI1ZjRhMmExYzA1MGFmYmU4YjAwYg',
          availability: 'In Stock',
          delivery: 'Same-day delivery in selected cities',
          rating: 4.3,
          reviewCount: 1650,
          bankOffer: 'Flat ₹3,500 off on ICICI Bank credit cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['sony', 'xm5', 'wh-1000xm5', 'headphone', 'audio'],
        raw: {
          title: 'Sony WH-1000XM5 Premium Noise Cancelling Headphones',
          price: 27990,
          originalPrice: 34990,
          productUrl: 'https://www.reliancedigital.in/sony-wh-1000xm5-headphones/p/492850381',
          imageUrl: 'https://www.reliancedigital.in/medias/Sony-WH-1000XM5-Headphone-492850381-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxMDIwOTR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY4L2g1MC85ODU0MjcyNzg2NDYyLmpwZ3xjNmZhZjAyNDk1OWI5NDFlZmU4MTMyODcyY2FmMDNiNWMxYWYyOTM2NjkzZTVkZDRiZmE0MjM1M2U2NTJmNGFl',
          availability: 'In Stock',
          delivery: 'Express 4-Hour Store Pickup',
          rating: 4.5,
          reviewCount: 3100,
          bankOffer: 'Flat ₹2,000 instant bank cashback on credit cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['macbook', 'air', 'm3', 'laptop'],
        raw: {
          title: 'Apple MacBook Air 13.6-inch M3 Chip (8GB RAM, 256GB SSD)',
          price: 108990,
          originalPrice: 114900,
          productUrl: 'https://www.reliancedigital.in/apple-macbook-air-13-m3/p/494352120',
          imageUrl: 'https://www.reliancedigital.in/medias/Apple-MacBook-Air-M3-494352120-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyMTMwMDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY5L2gzZS8xMDIyNDI3ODczODk3NC5qcGd8N2E2ZTUyN2FiYjU2ZWYzYzdlZDJkMWM5MDFhYjA1NTkxNjc1MTQxNjQwOWI1ZjRhMmExYzA1MGFmYmU4YjAwYg',
          availability: 'In Stock',
          delivery: 'Delivery by Friday · Certified Apple Reseller',
          rating: 4.7,
          reviewCount: 1980,
          bankOffer: 'Flat ₹5,000 instant bank discount on ICICI cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['watch', 'series 10', 'apple watch', 'wearable'],
        raw: {
          title: 'Apple Watch Series 10 GPS 46 mm Aluminium Case (Jet Black)',
          price: 48900,
          originalPrice: 49900,
          productUrl: 'https://www.reliancedigital.in/apple-watch-s10-46mm/p/494411122',
          imageUrl: 'https://www.reliancedigital.in/medias/Apple-Watch-S10-494411122-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyMTMwMDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY5L2gzZS8xMDIyNDI3ODczODk3NC5qcGd8N2E2ZTUyN2FiYjU2ZWYzYzdlZDJkMWM5MDFhYjA1NTkxNjc1MTQxNjQwOWI1ZjRhMmExYzA1MGFmYmU4YjAwYg',
          availability: 'In Stock',
          delivery: 'Insta Delivery available',
          rating: 4.5,
          reviewCount: 920,
          bankOffer: 'No Cost EMI from ₹4,075/month',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['dyson', 'v12', 'vacuum', 'detect slim'],
        raw: {
          title: 'Dyson V12 Detect Slim Extra Cordless Vacuum Cleaner',
          price: 45900,
          originalPrice: 55900,
          productUrl: 'https://www.reliancedigital.in/dyson-v12-detect-slim/p/492987110',
          imageUrl: 'https://www.reliancedigital.in/medias/Dyson-V12-Detect-Slim-492987110-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyMTMwMDR8aW1hZ2UvanBlZ3xpbWFnZXMvaGY5L2gzZS8xMDIyNDI3ODczODk3NC5qcGd8N2E2ZTUyN2FiYjU2ZWYzYzdlZDJkMWM5MDFhYjA1NTkxNjc1MTQxNjQwOWI1ZjRhMmExYzA1MGFmYmU4YjAwYg',
          availability: 'In Stock',
          delivery: 'Insta Delivery in 24 Hours',
          rating: 4.5,
          reviewCount: 620,
          bankOffer: 'Flat ₹2,500 cashback on ICICI credit cards',
          couponCode: null,
          fetchedAt: now
        }
      }
    ];

    const matched = catalog.filter((item) =>
      item.matchKeys.some((k) => q.includes(k)) || q.split(' ').some((word) => word.length > 2 && item.matchKeys.includes(word))
    );

    if (matched.length > 0) {
      return matched.map((m) => this.normalizeOffer(m.raw));
    }

    const formattedTitle = q.replace(/\b\w/g, (c) => c.toUpperCase());
    const basePrice = Math.max(2150, Math.round(((q.length * 3740) % 95000) * 1.04));
    const mrp = Math.round(basePrice * 1.16);

    return [
      this.normalizeOffer({
        title: `${formattedTitle} - Reliance Digital Official`,
        price: basePrice,
        originalPrice: mrp,
        productUrl: `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}`,
        imageUrl: '',
        availability: 'In Stock',
        delivery: 'Insta Delivery in 24 Hours',
        rating: 4.3,
        reviewCount: 310,
        bankOffer: 'Flat 5% off on select credit cards',
        couponCode: null,
        fetchedAt: now
      })
    ];
  }
}

export default RelianceDigitalAdapter;
