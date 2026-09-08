import { BaseStoreAdapter } from './BaseStoreAdapter.js';

export class FlipkartAdapter extends BaseStoreAdapter {
  constructor() {
    const isLiveConfigured = Boolean(
      process.env.FLIPKART_AFFILIATE_ID && process.env.FLIPKART_AFFILIATE_TOKEN
    );

    super('Flipkart', 'flipkart', {
      emoji: '⚡',
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
          title: 'Apple iPhone 16 (Black, 128 GB)',
          price: 68499,
          originalPrice: 79999,
          productUrl: 'https://www.flipkart.com/apple-iphone-16-black-128-gb/p/itm1234567890',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg',
          availability: 'In Stock',
          delivery: 'Delivery in 2 Days · Flipkart Plus',
          rating: 4.6,
          reviewCount: 18200,
          bankOffer: '5% Unlimited Cashback on Flipkart Axis Bank Card',
          couponCode: 'FLIPKART500',
          fetchedAt: now
        }
      },
      {
        matchKeys: ['samsung', 's25', 'galaxy', 'ultra'],
        raw: {
          title: 'SAMSUNG Galaxy S25 5G (Phantom Navy, 256 GB)',
          price: 72499,
          originalPrice: 84999,
          productUrl: 'https://www.flipkart.com/samsung-galaxy-s25-5g-phantom-navy-256-gb/p/itm987654321',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/e/y/g/-original-imahf22k5f7u54yz.jpeg',
          availability: 'In Stock',
          delivery: 'Delivery by Tomorrow',
          rating: 4.4,
          reviewCount: 7420,
          bankOffer: 'Flat ₹4,000 instant discount on Axis & Kotak cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['sony', 'xm5', 'wh-1000xm5', 'headphone', 'audio'],
        raw: {
          title: 'SONY WH-1000XM5 Bluetooth Headset with Active Noise Cancellation',
          price: 25490,
          originalPrice: 34990,
          productUrl: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itmd12349087',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/l3uhvgw0/headphone/c/h/q/-original-imageuztghyfxu8g.jpeg',
          availability: 'In Stock',
          delivery: 'Delivery in 3 Days',
          rating: 4.5,
          reviewCount: 8400,
          bankOffer: 'Extra ₹1,000 off on SuperCoins redemption',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['macbook', 'air', 'm3', 'laptop'],
        raw: {
          title: 'Apple MacBook Air Apple M3 - (8 GB/256 GB SSD/macOS Sonoma) MRXN3HN/A',
          price: 106990,
          originalPrice: 114900,
          productUrl: 'https://www.flipkart.com/apple-macbook-air-apple-m3-8-gb-256-gb-ssd-macos-sonoma-mrxn3hn-a/p/itm54321098',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/computer/2/v/v/-original-imagfdf43fgnzzhy.jpeg',
          availability: 'In Stock',
          delivery: 'Free delivery by Friday',
          rating: 4.7,
          reviewCount: 4200,
          bankOffer: 'Flat ₹4,500 off on HDFC credit card EMI',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['watch', 'series 10', 'apple watch', 'wearable'],
        raw: {
          title: 'Apple Watch Series 10 GPS 46mm Aluminium Case with Sport Band',
          price: 46900,
          originalPrice: 49900,
          productUrl: 'https://www.flipkart.com/apple-watch-series-10-gps-46mm/p/itm33445566',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/y/1/6/-original-imagtzh4n6j4zhyq.jpeg',
          availability: 'In Stock',
          delivery: 'Delivery by Thursday',
          rating: 4.6,
          reviewCount: 4210,
          bankOffer: 'Extra ₹2,500 off with select debit cards',
          couponCode: null,
          fetchedAt: now
        }
      },
      {
        matchKeys: ['dyson', 'v12', 'vacuum', 'detect slim'],
        raw: {
          title: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner',
          price: 43900,
          originalPrice: 55900,
          productUrl: 'https://www.flipkart.com/dyson-v12-detect-slim-cordless-vacuum/p/itmdyson123',
          imageUrl: 'https://rukminim2.flixcart.com/image/832/832/l0bbonk0/vacuum-cleaner/1/b/r/-original-imagc48yzv5gphk2.jpeg',
          availability: 'In Stock',
          delivery: 'Delivery by Thursday · Plus Assured',
          rating: 4.5,
          reviewCount: 1890,
          bankOffer: '₹2,500 off with Flipkart Axis Bank Card',
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
    const basePrice = Math.max(1899, Math.round(((q.length * 3740) % 95000) * 0.97));
    const mrp = Math.round(basePrice * 1.20);

    return [
      this.normalizeOffer({
        title: `${formattedTitle} - Flipkart Certified Assured`,
        price: basePrice,
        originalPrice: mrp,
        productUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
        imageUrl: '',
        availability: 'In Stock',
        delivery: 'Delivery in 2 Days · Plus Assured',
        rating: 4.3,
        reviewCount: 890,
        bankOffer: '5% Unlimited Cashback with Flipkart Axis Bank',
        couponCode: null,
        fetchedAt: now
      })
    ];
  }
}

export default FlipkartAdapter;
