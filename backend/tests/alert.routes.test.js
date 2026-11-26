import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';
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

const userA = { id: 'usr_test_user_a', email: 'usera@example.com', fullName: 'User A' };
const userB = { id: 'usr_test_user_b', email: 'userb@example.com', fullName: 'User B' };

const tokenA = jwt.sign(userA, config.jwtSecret, { expiresIn: '1h' });
const tokenB = jwt.sign(userB, config.jwtSecret, { expiresIn: '1h' });

// ─── SECTION 1: Database Unavailability Verification ──────────────────────────
test('DB-1. POST /v1/alerts returns 500 when database fails (No silent 201)', async () => {
  const originalCreate = prisma.priceAlert.create;
  const originalFindFirst = prisma.priceAlert.findFirst;

  prisma.priceAlert.findFirst = async () => {
    const dbErr = new Error("Can't reach database server at localhost:5432");
    dbErr.code = 'P1001';
    throw dbErr;
  };

  try {
    const res = await fetch(`${baseUrl}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({ productId: 'iphone-16-128', targetPrice: 60000 })
    });

    const body = await res.json();
    assert.equal(res.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.statusCode, 500);
  } finally {
    prisma.priceAlert.create = originalCreate;
    prisma.priceAlert.findFirst = originalFindFirst;
  }
});

test('DB-2. GET /v1/alerts returns 500 when database fails (No fake alerts)', async () => {
  const originalFindMany = prisma.priceAlert.findMany;

  prisma.priceAlert.findMany = async () => {
    const dbErr = new Error("Can't reach database server at localhost:5432");
    dbErr.code = 'P1001';
    throw dbErr;
  };

  try {
    const res = await fetch(`${baseUrl}/alerts`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });

    const body = await res.json();
    assert.equal(res.status, 500);
    assert.equal(body.success, false);
  } finally {
    prisma.priceAlert.findMany = originalFindMany;
  }
});

// ─── SECTION 2: Explicit Unit Mocks (Route Logic Verification) ─────────────────
const mockDbStore = [];

test.beforeEach(() => {
  mockDbStore.length = 0;

  prisma.priceAlert.findFirst = async ({ where }) => {
    return mockDbStore.find((a) => {
      if (where.id && a.id !== where.id) return false;
      if (where.userId && a.userId !== where.userId) return false;
      if (where.productId && a.productId !== where.productId) return false;
      if (where.store !== undefined && a.store !== where.store) return false;
      if (where.targetPrice !== undefined && a.targetPrice !== where.targetPrice) return false;
      if (where.isActive !== undefined && a.isActive !== where.isActive) return false;
      if (where.NOT && where.NOT.id && a.id === where.NOT.id) return false;
      return true;
    }) || null;
  };

  prisma.priceAlert.create = async ({ data }) => {
    const record = {
      id: 'alt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockDbStore.push(record);
    return record;
  };

  prisma.priceAlert.findMany = async ({ where }) => {
    return mockDbStore.filter((a) => {
      if (where.userId && a.userId !== where.userId) return false;
      if (where.isActive !== undefined && a.isActive !== where.isActive) return false;
      if (where.isTriggered !== undefined && a.isTriggered !== where.isTriggered) return false;
      return true;
    });
  };

  prisma.priceAlert.update = async ({ where, data }) => {
    const idx = mockDbStore.findIndex((a) => a.id === where.id);
    if (idx === -1) throw new Error('Record not found');
    mockDbStore[idx] = { ...mockDbStore[idx], ...data, updatedAt: new Date() };
    return mockDbStore[idx];
  };

  prisma.priceAlert.delete = async ({ where }) => {
    const idx = mockDbStore.findIndex((a) => a.id === where.id);
    if (idx === -1) throw new Error('Record not found');
    const removed = mockDbStore.splice(idx, 1)[0];
    return removed;
  };
});

let testAlertId = null;

test('1. POST /v1/alerts without authentication -> 401', async () => {
  const res = await fetch(`${baseUrl}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: 'iphone-16-128', targetPrice: 50000 })
  });

  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.error, 'UNAUTHORIZED');
});

test('2. POST /v1/alerts with invalid productId -> 404', async () => {
  const res = await fetch(`${baseUrl}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ productId: 'nonexistent-invalid-product-999', targetPrice: 50000 })
  });

  const body = await res.json();
  assert.equal(res.status, 404);
  assert.equal(body.success, false);
  assert.equal(body.error, 'NOT_FOUND');
});

test('3. POST /v1/alerts with targetPrice >= current price -> 400', async () => {
  const res = await fetch(`${baseUrl}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ productId: 'iphone-16-128', targetPrice: 999999 })
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error, 'VALIDATION_ERROR');
});

test('4. POST /v1/alerts valid alert -> 201', async () => {
  const res = await fetch(`${baseUrl}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ productId: 'iphone-16-128', targetPrice: 60000 })
  });

  const body = await res.json();
  assert.equal(res.status, 201);
  assert.equal(body.success, true);
  assert.ok(body.data.id);
  assert.equal(body.data.productId, 'iphone-16-128');
  assert.equal(body.data.targetPrice, 60000);
  assert.equal(body.data.userId, userA.id);

  testAlertId = body.data.id;
});

test('5. POST /v1/alerts duplicate active alert -> 409', async () => {
  mockDbStore.push({
    id: 'alt_existing',
    userId: userA.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 60000,
    initialPrice: 68499,
    currentPrice: 68499,
    isActive: true,
    isTriggered: false
  });

  const res = await fetch(`${baseUrl}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ productId: 'iphone-16-128', targetPrice: 60000 })
  });

  const body = await res.json();
  assert.equal(res.status, 409);
  assert.equal(body.success, false);
  assert.equal(body.error, 'DUPLICATE_ALERT');
});

test('6. GET /v1/alerts returns only authenticated user\'s alerts', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });
  mockDbStore.push({
    id: 'alt_user_b',
    userId: userB.id,
    productId: 'iphone-16-128',
    targetPrice: 62000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.length, 1);
  assert.equal(body.data[0].userId, userA.id);
});

test('7. GET /v1/alerts another user\'s alert is impossible', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.length, 0);
});

test('8. PUT /v1/alerts/:id another user\'s alert -> 404', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts/alt_user_a`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({ targetPrice: 58000 })
  });

  const body = await res.json();
  assert.equal(res.status, 404);
  assert.equal(body.success, false);
});

test('9. PUT /v1/alerts/:id valid targetPrice -> success', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts/alt_user_a`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ targetPrice: 55000 })
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.targetPrice, 55000);
});

test('10. DELETE /v1/alerts/:id another user\'s alert -> 404', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts/alt_user_a`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });

  const body = await res.json();
  assert.equal(res.status, 404);
  assert.equal(body.success, false);
});

test('11. DELETE /v1/alerts/:id own alert -> success', async () => {
  mockDbStore.push({
    id: 'alt_user_a',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 60000,
    isActive: true
  });

  const res = await fetch(`${baseUrl}/alerts/alt_user_a`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(mockDbStore.length, 0);
});

// ─── SECTION 3: Trigger Evaluation Endpoint Tests (POST /v1/alerts/check) ────
test('CHK-1. POST /v1/alerts/check without Authorization header -> 401', async () => {
  const res = await fetch(`${baseUrl}/alerts/check`, {
    method: 'POST'
  });

  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.error, 'UNAUTHORIZED');
});

test('CHK-2. POST /v1/alerts/check with invalid JWT -> 401', async () => {
  const res = await fetch(`${baseUrl}/alerts/check`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer invalid_bogus_token_123' }
  });

  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.error, 'UNAUTHORIZED');
});

test('CHK-3. POST /v1/alerts/check with valid JWT -> returns evaluation summary', async () => {
  mockDbStore.push({
    id: 'alt_trigger_1',
    userId: userA.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const res = await fetch(`${baseUrl}/alerts/check`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.data);
  assert.equal(typeof body.data.checked, 'number');
  assert.equal(typeof body.data.triggered, 'number');
  assert.equal(typeof body.data.skipped, 'number');
  assert.equal(typeof body.data.failed, 'number');
  assert.ok(Array.isArray(body.data.triggeredAlerts));
});

test('CHK-4. POST /v1/alerts/check database failure -> 500 (No fake success)', async () => {
  const originalFindMany = prisma.priceAlert.findMany;

  prisma.priceAlert.findMany = async () => {
    const dbErr = new Error("Can't reach database server at localhost:5432");
    dbErr.code = 'P1001';
    throw dbErr;
  };

  try {
    const res = await fetch(`${baseUrl}/alerts/check`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });

    const body = await res.json();
    assert.equal(res.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.statusCode, 500);
  } finally {
    prisma.priceAlert.findMany = async ({ where }) => {
      return mockDbStore.filter((a) => {
        if (where.userId && a.userId !== where.userId) return false;
        if (where.isActive !== undefined && a.isActive !== where.isActive) return false;
        if (where.isTriggered !== undefined && a.isTriggered !== where.isTriggered) return false;
        return true;
      });
    };
  }
});

test('CHK-5. POST /v1/alerts/check user scoping: User A evaluates only User A active alerts and excludes User B alerts', async () => {
  // Alert for User A (eligible to trigger)
  mockDbStore.push({
    id: 'alt_user_a_trigger',
    userId: userA.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  // Alert for User B (also eligible to trigger)
  mockDbStore.push({
    id: 'alt_user_b_trigger',
    userId: userB.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const res = await fetch(`${baseUrl}/alerts/check`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.checked, 1);
  assert.equal(body.data.triggered, 1);
  assert.equal(body.data.triggeredAlerts.length, 1);
  assert.equal(body.data.triggeredAlerts[0].userId, userA.id);

  // User B's alert must remain active and untriggered in the database
  const userBAlert = mockDbStore.find((a) => a.id === 'alt_user_b_trigger');
  assert.equal(userBAlert.isActive, true);
  assert.equal(userBAlert.isTriggered, false);
});

test('CHK-6. POST /v1/alerts/check ignores userId passed in body or query parameters', async () => {
  mockDbStore.push({
    id: 'alt_user_a_check',
    userId: userA.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  mockDbStore.push({
    id: 'alt_user_b_check',
    userId: userB.id,
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  // User A attempts to pass User B's ID in query and body
  const res = await fetch(`${baseUrl}/alerts/check?userId=${userB.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ userId: userB.id })
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.checked, 1);
  assert.equal(body.data.triggeredAlerts[0].userId, userA.id);

  // User B's alert must NOT be triggered
  const userBAlert = mockDbStore.find((a) => a.id === 'alt_user_b_check');
  assert.equal(userBAlert.isTriggered, false);
});

test('CHK-7. POST /v1/alerts/check excludes inactive and triggered alerts of authenticated user', async () => {
  // Already triggered alert
  mockDbStore.push({
    id: 'alt_user_a_already_triggered',
    userId: userA.id,
    productId: 'iphone-16-128',
    targetPrice: 70000,
    isActive: false,
    isTriggered: true
  });

  const res = await fetch(`${baseUrl}/alerts/check`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });

  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.checked, 0);
  assert.equal(body.data.triggered, 0);
});
