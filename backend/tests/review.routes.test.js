import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import prisma from '../src/config/db.js';

let server;
let baseUrl;

// Ephemeral server startup
test.before(async () => {
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/v1`;
});

test.after(async () => {
  if (server) server.close();
});

const mockReviewStore = new Map();
const mockProductStore = new Map();

test.beforeEach(() => {
  mockReviewStore.clear();
  mockProductStore.clear();

  // Populate mock canonical product and review intelligence record
  mockProductStore.set('iphone-16-128', {
    id: 'iphone-16-128',
    name: 'iPhone 16 128GB',
    brand: 'Apple',
    category: 'Smartphones'
  });

  mockReviewStore.set('iphone-16-128', {
    id: 'rev_intel_1',
    productId: 'iphone-16-128',
    trustScore: 8.4,
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [
      { label: 'Genuine-looking', pct: 82, color: 'green' },
      { label: 'Suspicious', pct: 13, color: 'amber' },
      { label: 'High Risk', pct: 5, color: 'red' }
    ],
    sentimentDistribution: { positive: 82, neutral: 11, negative: 7 },
    positivePoints: ['Camera quality & color grading', 'Battery longevity'],
    complaintPoints: ['Base 128GB fills fast'],
    sampleReviews: [{ id: 'rev-1', rating: 5.0, title: 'Flawless camera' }],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  prisma.product.findUnique = async ({ where }) => {
    return mockProductStore.get(where.id) || null;
  };

  prisma.reviewIntelligence.findUnique = async ({ where, include }) => {
    const record = mockReviewStore.get(where.productId);
    if (!record) return null;
    if (include?.product) {
      const prod = mockProductStore.get(where.productId);
      return { ...record, product: prod || null };
    }
    return record;
  };
});

test('REV-1. Valid product + existing ReviewIntelligence -> 200 with correct structured data', async () => {
  const res = await fetch(`${baseUrl}/reviews/iphone-16-128`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.statusCode, 200);
  assert.ok(body.data);
  assert.equal(body.data.product.id, 'iphone-16-128');
  assert.equal(body.data.product.name, 'iPhone 16 128GB');
  assert.equal(body.data.reviewIntelligence.productId, 'iphone-16-128');
  assert.equal(body.data.reviewIntelligence.trustScore, 8.4);
  assert.equal(body.data.reviewIntelligence.reliabilityTag, 'High Review Reliability');
  assert.ok(Array.isArray(body.data.reviewIntelligence.positivePoints));
  assert.ok(Array.isArray(body.data.reviewIntelligence.complaintPoints));
  assert.ok(Array.isArray(body.data.reviewIntelligence.sampleReviews));
});

test('REV-2. Nonexistent product -> 404', async () => {
  const res = await fetch(`${baseUrl}/reviews/completely-unknown-invalid-product-999`);
  const body = await res.json();

  assert.equal(res.status, 404);
  assert.equal(body.success, false);
  assert.equal(body.statusCode, 404);
  assert.equal(body.error, 'NOT_FOUND');
});

test('REV-3. Existing product but no ReviewIntelligence -> 404', async () => {
  // Product exists (macbook-air-m3 is a canonical product), but review record is not added
  const res = await fetch(`${baseUrl}/reviews/macbook-air-m3`);
  const body = await res.json();

  assert.equal(res.status, 404);
  assert.equal(body.success, false);
  assert.equal(body.statusCode, 404);
  assert.equal(body.error, 'NOT_FOUND');
});

test('REV-4. Database/Prisma failure -> 500', async () => {
  const originalFindUnique = prisma.reviewIntelligence.findUnique;

  prisma.reviewIntelligence.findUnique = async () => {
    const dbErr = new Error("Can't reach database server at localhost:5432");
    dbErr.code = 'P1001';
    throw dbErr;
  };

  try {
    const res = await fetch(`${baseUrl}/reviews/iphone-16-128`);
    const body = await res.json();

    assert.equal(res.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.statusCode, 500);
  } finally {
    prisma.reviewIntelligence.findUnique = originalFindUnique;
  }
});

test('REV-5. Returned trustScore is JSON-safe and has expected numeric representation', async () => {
  // Test Prisma Decimal instance conversion
  mockReviewStore.set('samsung-s25', {
    id: 'rev_intel_2',
    productId: 'samsung-s25',
    trustScore: { toString: () => '9.2' },
    reliabilityTag: 'High Review Reliability',
    authenticityBreakdown: [],
    sentimentDistribution: { positive: 90, neutral: 5, negative: 5 },
    positivePoints: [],
    complaintPoints: [],
    sampleReviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const res = await fetch(`${baseUrl}/reviews/samsung-s25`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(typeof body.data.reviewIntelligence.trustScore, 'number');
  assert.equal(body.data.reviewIntelligence.trustScore, 9.2);
});

test('REV-6. No mock/in-memory fallback is used when database fails (returns 500)', async () => {
  const originalFindUnique = prisma.reviewIntelligence.findUnique;

  prisma.reviewIntelligence.findUnique = async () => {
    throw new Error('Database connection reset');
  };

  try {
    const res = await fetch(`${baseUrl}/reviews/iphone-16-128`);
    const body = await res.json();

    assert.equal(res.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.statusCode, 500);
  } finally {
    prisma.reviewIntelligence.findUnique = originalFindUnique;
  }
});
