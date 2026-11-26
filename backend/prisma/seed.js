import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEVELOPMENT_REVIEW_DATA = [
  {
    productId: 'iphone-16-128',
    trustScore: 8.4,
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 82, color: 'green' },
      { label: 'Suspicious', pct: 13, color: 'amber' },
      { label: 'High Risk', pct: 5, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 82,
      neutral: 11,
      negative: 7
    },
    positivePoints: [
      'Camera quality & color grading',
      'All-day battery longevity',
      'Smooth A18 Bionic performance',
      'Bright outdoor Super Retina display'
    ],
    complaintPoints: [
      'Base 128GB storage fills fast with 4K video',
      'Wired charging speed capped at 27W',
      'Premium pricing for entry tier'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-iphone-1',
        rating: 5,
        title: 'Flawless camera and snappy performance',
        text: 'Battery easily lasts a full day under heavy camera use. Display brightness under direct sunlight is incredible.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-iphone-2',
        rating: 4,
        title: 'Solid upgrade with lightweight chassis',
        text: 'Noticeably lighter than titanium predecessors. Software response is fast.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-iphone-3',
        rating: 3,
        title: 'Good performance, standard charging speed',
        text: 'Takes over 75 minutes for a full charge. Expected faster charging in this tier.',
        source: 'DEMO_DATA'
      }
    ]
  },
  {
    productId: 'macbook-air-m3',
    trustScore: 9.1,
    reliabilityTag: 'Extremely High Authenticity',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 90, color: 'green' },
      { label: 'Suspicious', pct: 8, color: 'amber' },
      { label: 'High Risk', pct: 2, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 88,
      neutral: 8,
      negative: 4
    },
    positivePoints: [
      'Silent fanless operation with M3 power',
      '18+ hour battery endurance',
      'Crisp Liquid Retina display',
      'Sleek ultra-portable enclosure'
    ],
    complaintPoints: [
      'Base 8GB unified memory limits heavy multitasking',
      'Dual display output requires closing laptop lid',
      'Midnight finish retains fingerprints'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-macbook-1',
        rating: 5,
        title: 'Best portable laptop for everyday work',
        text: 'Incredible battery life and completely silent operation. Handles development and multitasking effortlessly.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-macbook-2',
        rating: 4,
        title: 'Sleek design, recommendation to upgrade memory',
        text: 'Performance is stellar, but consider configuring 16GB RAM for heavy tab workflows.',
        source: 'DEMO_DATA'
      }
    ]
  },
  {
    productId: 'samsung-s25',
    trustScore: 8.1,
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 79, color: 'green' },
      { label: 'Suspicious', pct: 15, color: 'amber' },
      { label: 'High Risk', pct: 6, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 78,
      neutral: 14,
      negative: 8
    },
    positivePoints: [
      'Vibrant 120Hz Dynamic AMOLED panel',
      'Powerful Snapdragon 8 Elite chipset',
      'Enhanced AI photo post-processing',
      'Slim ergonomic build'
    ],
    complaintPoints: [
      'Slight thermal warming under sustained gaming',
      'Pre-installed software options require setup tuning',
      'Charging adapter omitted from packaging'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-s25-1',
        rating: 5,
        title: 'Stunning display and fluid navigation',
        text: 'Screen quality is top tier. Outdoor legibility is impressive.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-s25-2',
        rating: 3,
        title: 'Good hardware, warms during long gaming sessions',
        text: 'High refresh rate performance is great, but device warms up after 40 minutes of intense gaming.',
        source: 'DEMO_DATA'
      }
    ]
  },
  {
    productId: 'sony-xm5',
    trustScore: 8.7,
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 85, color: 'green' },
      { label: 'Suspicious', pct: 11, color: 'amber' },
      { label: 'High Risk', pct: 4, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 85,
      neutral: 9,
      negative: 6
    },
    positivePoints: [
      'Industry-leading active noise cancellation',
      'Warm balanced sound signature',
      'Crystal clear call quality with 8-mic array',
      'Lightweight comfortable headband'
    ],
    complaintPoints: [
      'Earcups do not fold inward like XM4',
      'Carrying case occupies more bag space',
      'Touch controls can be overly sensitive'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-sony-1',
        rating: 5,
        title: 'Silence at the touch of a button',
        text: 'Cancels background noise and office chatter completely. Battery easily lasts a week.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-sony-2',
        rating: 4,
        title: 'Top-tier ANC, wish it folded smaller',
        text: 'Sound quality and noise isolation are excellent. Non-folding hinge makes the case bulky.',
        source: 'DEMO_DATA'
      }
    ]
  },
  {
    productId: 'apple-watch-s10',
    trustScore: 8.2,
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 80, color: 'green' },
      { label: 'Suspicious', pct: 14, color: 'amber' },
      { label: 'High Risk', pct: 6, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 80,
      neutral: 12,
      negative: 8
    },
    positivePoints: [
      'Thinner chassis with expanded OLED display',
      'Fast 80% charge in 30 minutes',
      'Accurate health and fitness sensors',
      'Water resistance for watersports'
    ],
    complaintPoints: [
      'Single-day battery life requires daily charging routine',
      'Requires companion iPhone for full functionality',
      'Jet Black finish shows micro-scratches over time'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-watch-1',
        rating: 5,
        title: 'Thinner profile and wide viewing angles',
        text: 'Noticeably lighter on the wrist. Display text is easy to read at an angle.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-watch-2',
        rating: 3,
        title: 'Great feature set, still needs daily charging',
        text: 'Fast charging helps, but battery still requires daily top-ups.',
        source: 'DEMO_DATA'
      }
    ]
  },
  {
    productId: 'dyson-v12',
    trustScore: 7.9,
    reliabilityTag: 'Moderate Authenticity Filtered',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 75, color: 'green' },
      { label: 'Suspicious', pct: 18, color: 'amber' },
      { label: 'High Risk', pct: 7, color: 'red' }
    ],
    sentimentDistribution: {
      positive: 76,
      neutral: 14,
      negative: 10
    },
    positivePoints: [
      'Illuminated cleaner head reveals hidden dust',
      'Single-button power control',
      'De-tangling Motorbar for pet hair',
      'Lightweight cordless maneuverability'
    ],
    complaintPoints: [
      'Dust bin capacity requires frequent emptying',
      'Boost mode drains battery within 8 minutes',
      'Replacement filter cost is high'
    ],
    sampleReviews: [
      {
        id: 'demo-rev-dyson-1',
        rating: 5,
        title: 'Laser reveals hidden dust effortlessly',
        text: 'Surprising amount of dust picked up from hard floors. Lightweight to carry up stairs.',
        source: 'DEMO_DATA'
      },
      {
        id: 'demo-rev-dyson-2',
        rating: 4,
        title: 'Powerful vacuum, compact dust canister',
        text: 'Cleaning performance is superb, but bin requires emptying multiple times during a full session.',
        source: 'DEMO_DATA'
      }
    ]
  }
];

export async function seedDevelopmentReviews() {
  console.log('[Seed] Starting Development Review Intelligence Seeding...');

  for (const item of DEVELOPMENT_REVIEW_DATA) {
    // 1. Ensure Product record exists
    await prisma.product.upsert({
      where: { id: item.productId },
      create: {
        id: item.productId,
        name: item.productId.replace(/-/g, ' ').toUpperCase()
      },
      update: {}
    });

    // 2. Upsert ReviewIntelligence record
    const result = await prisma.reviewIntelligence.upsert({
      where: { productId: item.productId },
      create: {
        productId: item.productId,
        trustScore: item.trustScore,
        reliabilityTag: item.reliabilityTag,
        authenticityBreakdown: item.authenticityBreakdown,
        sentimentDistribution: item.sentimentDistribution,
        positivePoints: item.positivePoints,
        complaintPoints: item.complaintPoints,
        sampleReviews: item.sampleReviews
      },
      update: {
        trustScore: item.trustScore,
        reliabilityTag: item.reliabilityTag,
        authenticityBreakdown: item.authenticityBreakdown,
        sentimentDistribution: item.sentimentDistribution,
        positivePoints: item.positivePoints,
        complaintPoints: item.complaintPoints,
        sampleReviews: item.sampleReviews
      }
    });

    console.log(`[Seed] Seeded ReviewIntelligence for ${result.productId}`);
  }

  console.log('[Seed] Seeding completed successfully.');
}

// Execute seed directly if called as main script
if (process.argv[1]?.endsWith('seed.js')) {
  seedDevelopmentReviews()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('[Seed Error]:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
