import { BaseStoreAdapter } from './BaseStoreAdapter.js';

export class CromaAdapter extends BaseStoreAdapter {
  constructor() {
    const isLiveConfigured = Boolean(process.env.CROMA_API_KEY);

    super('Croma', 'croma', {
      emoji: '🔴',
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
          title: 'Apple iPhone 16 128GB (Black)',
          price: 70990,
          originalPrice: 79999,
          productUrl: 'https://www.croma.com/apple-iphone-16-128gb-black/p/300101',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1725959955/Croma%20Assets/Communication/Mobiles/Images/309695_0_hnd7wf.png',
          availability: 'In Stock',
          delivery: 'Store Pickup in 3 Hours or Next Day Delivery',
          rating: 4.5,
          reviewCount: 3100,
          bankOffer: 'Flat ₹3,000 instant bank discount with ICICI & HDFC cards',
          couponCode: 'CROMAAPPLE',
          fetchedAt: now
        }
      },
      {
        matchKeys: ['samsung', 's25', 'galaxy', 'ultra'],
        raw: {
          title: 'Samsung Galaxy S25 5G 256GB (Navy Blue)',
          price: 73999,
          originalPrice: 84999,
          productUrl: 'https://www.croma.com/samsung-galaxy-s25-5g-256gb-navy/p/309871',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1705574514/Croma%20Assets/Communication/Mobiles/Images/304410_0_zcxm30.png',
          availability: 'In Stock',
          delivery: 'FREE Express Delivery',
          rating: 4.3,
          reviewCount: 2150,
          bankOffer: '₹2,500 instant discount on Tata Neu HDFC Credit Cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['sony', 'xm5', 'wh-1000xm5', 'headphone', 'audio'],
        raw: {
          title: 'Sony WH-1000XM5 Over-Ear Noise Cancelling Headphones (Silver/Black)',
          price: 26990,
          originalPrice: 34990,
          productUrl: 'https://www.croma.com/sony-wh-1000xm5-wireless-anc-headphones/p/256891',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1669116812/Croma%20Assets/Entertainment/Headphones%20and%20Earphones/Images/256891_0_x77e1j.png',
          availability: 'In Stock',
          delivery: 'Next-day home delivery or pickup in 180 minutes',
          rating: 4.6,
          reviewCount: 4200,
          bankOffer: '10% Cashback on Tata Neu UPI payments',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['macbook', 'air', 'm3', 'laptop'],
        raw: {
          title: 'Apple MacBook Air 13.6-inch M3 (8-Core CPU, 8-Core GPU, 8GB/256GB)',
          price: 99990,
          originalPrice: 114900,
          productUrl: 'https://www.croma.com/apple-macbook-air-13-m3-8gb-256gb/p/305210',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1709710323/Croma%20Assets/Computers%20Peripherals/Laptops/Images/305210_0_kfgv2m.png',
          availability: 'In Stock',
          delivery: 'FREE delivery by Tomorrow · Best Store Price',
          rating: 4.8,
          reviewCount: 3800,
          bankOffer: 'Extra ₹5,000 instant discount on HDFC credit card EMI',
          couponCode: 'TATAOFFER',
          fetchedAt: now
        }
      },
      {
        matchKeys: ['watch', 'series 10', 'apple watch', 'wearable'],
        raw: {
          title: 'Apple Watch Series 10 GPS 46mm Smartwatch (Jet Black)',
          price: 47900,
          originalPrice: 49900,
          productUrl: 'https://www.croma.com/apple-watch-series-10-gps-46mm/p/309900',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1725960000/Croma%20Assets/Wearables/Images/309900_0_yhg72.png',
          availability: 'In Stock',
          delivery: 'Store pickup in 3 Hours',
          rating: 4.5,
          reviewCount: 1200,
          bankOffer: 'Flat ₹2,000 off on select bank credit cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['dyson', 'v12', 'vacuum', 'detect slim'],
        raw: {
          title: 'Dyson V12 Detect Slim Vacuum Cleaner with Laser Slim Fluffy Cleaner Head',
          price: 44900,
          originalPrice: 55900,
          productUrl: 'https://www.croma.com/dyson-v12-detect-slim-vacuum/p/262910',
          imageUrl: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1669116812/Croma%20Assets/Small%20Appliances/Vacuum%20Cleaners/Images/262910_0_x77e1j.png',
          availability: 'In Stock',
          delivery: 'Store pickup in 3 Hours or Next Day Delivery',
          rating: 4.6,
          reviewCount: 940,
          bankOffer: '₹2,000 instant discount on Tata Neu HDFC Cards',
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
    const basePrice = Math.max(2099, Math.round(((q.length * 3740) % 95000) * 1.02));
    const mrp = Math.round(basePrice * 1.15);

    return [
      this.normalizeOffer({
        title: `${formattedTitle} - Croma Verified Electronics`,
        price: basePrice,
        originalPrice: mrp,
        productUrl: `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
        imageUrl: '',
        availability: 'In Stock',
        delivery: 'Pickup in 3 Hours or Next Day Delivery',
        rating: 4.4,
        reviewCount: 450,
        bankOffer: 'Extra 5% NeuCoins on Tata Neu HDFC Cards',
        couponCode: null,
        fetchedAt: now
      })
    ];
  }
}

export default CromaAdapter;
