import test from 'node:test';
import assert from 'node:assert/strict';
import { alertTriggerService } from '../src/services/alertTrigger.service.js';
import { comparisonService } from '../src/services/comparison.service.js';
import prisma from '../src/config/db.js';

// Setup mock store for database state in tests
const mockAlertStore = [];

test.beforeEach(() => {
  mockAlertStore.length = 0;

  prisma.priceAlert.findMany = async ({ where }) => {
    return mockAlertStore.filter((a) => {
      if (where.userId && a.userId !== where.userId) return false;
      if (where.isActive !== undefined && a.isActive !== where.isActive) return false;
      if (where.isTriggered !== undefined && a.isTriggered !== where.isTriggered) return false;
      if (where.productId && a.productId !== where.productId) return false;
      return true;
    });
  };

  prisma.priceAlert.update = async ({ where, data }) => {
    const idx = mockAlertStore.findIndex((a) => a.id === where.id);
    if (idx === -1) throw new Error('Record not found');
    mockAlertStore[idx] = {
      ...mockAlertStore[idx],
      ...data,
      updatedAt: new Date()
    };
    return mockAlertStore[idx];
  };

  comparisonService.compareByProductId = async () => ({
    lowestPrice: 68499,
    bestDeal: { price: 68499, store: 'Amazon' },
    offers: [
      { store: 'Amazon', price: 68499, isAvailable: true }
    ]
  });
});

test('1. Active alert with current price above target -> remains active and not triggered', async () => {
  mockAlertStore.push({
    id: 'alt_1',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 60000,
    initialPrice: 69999,
    currentPrice: 69999,
    isActive: true,
    isTriggered: false
  });

  const summary = await alertTriggerService.evaluateActiveAlerts();
  assert.equal(summary.checked, 1);
  assert.equal(summary.triggered, 0);
  assert.equal(mockAlertStore[0].isActive, true);
  assert.equal(mockAlertStore[0].isTriggered, false);
  assert.ok(mockAlertStore[0].lastCheckedAt);
});

test('2. Active alert with current price exactly equal to target -> triggers', async () => {
  mockAlertStore.push({
    id: 'alt_2',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 68499,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const summary = await alertTriggerService.evaluateActiveAlerts();
  assert.equal(summary.checked, 1);
  assert.equal(summary.triggered, 1);
  assert.equal(mockAlertStore[0].isActive, false);
  assert.equal(mockAlertStore[0].isTriggered, true);
  assert.equal(mockAlertStore[0].currentPrice, 68499);
  assert.ok(mockAlertStore[0].triggeredAt);
});

test('3. Active alert with current price below target -> triggers', async () => {
  mockAlertStore.push({
    id: 'alt_3',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const summary = await alertTriggerService.evaluateActiveAlerts();
  assert.equal(summary.checked, 1);
  assert.equal(summary.triggered, 1);
  assert.equal(mockAlertStore[0].isActive, false);
  assert.equal(mockAlertStore[0].isTriggered, true);
});

test('4. Store-specific alert: Amazon above target, Flipkart below target -> Amazon alert does NOT trigger', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 68499,
    offers: [
      { store: 'Amazon', price: 72000, isAvailable: true },
      { store: 'Flipkart', price: 68499, isAvailable: true }
    ]
  });

  try {
    mockAlertStore.push({
      id: 'alt_amazon',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: 'Amazon',
      targetPrice: 70000,
      initialPrice: 75000,
      currentPrice: 75000,
      isActive: true,
      isTriggered: false
    });

    const summary = await alertTriggerService.evaluateActiveAlerts();
    assert.equal(summary.checked, 1);
    assert.equal(summary.triggered, 0);
    assert.equal(mockAlertStore[0].isActive, true);
    assert.equal(mockAlertStore[0].isTriggered, false);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('5. Any-store alert: one store below target -> triggers using lowest valid offer', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 68499,
    bestDeal: { price: 68499, store: 'Flipkart' },
    offers: [
      { store: 'Amazon', price: 72000, isAvailable: true },
      { store: 'Flipkart', price: 68499, isAvailable: true }
    ]
  });

  try {
    mockAlertStore.push({
      id: 'alt_anystore',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: null,
      targetPrice: 70000,
      initialPrice: 75000,
      currentPrice: 75000,
      isActive: true,
      isTriggered: false
    });

    const summary = await alertTriggerService.evaluateActiveAlerts();
    assert.equal(summary.checked, 1);
    assert.equal(summary.triggered, 1);
    assert.equal(mockAlertStore[0].isActive, false);
    assert.equal(mockAlertStore[0].isTriggered, true);
    assert.equal(mockAlertStore[0].currentPrice, 68499);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('6. Alert with no valid current offer -> does NOT trigger', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 0,
    bestDeal: null,
    offers: []
  });

  try {
    mockAlertStore.push({
      id: 'alt_no_offer',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: null,
      targetPrice: 999999,
      initialPrice: 75000,
      currentPrice: 75000,
      isActive: true,
      isTriggered: false
    });

    const summary = await alertTriggerService.evaluateActiveAlerts();
    assert.equal(summary.checked, 1);
    assert.equal(summary.triggered, 0);
    assert.equal(summary.skipped, 1);
    assert.equal(mockAlertStore[0].isActive, true);
    assert.equal(mockAlertStore[0].isTriggered, false);
    assert.ok(mockAlertStore[0].lastCheckedAt);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('7. Triggered alert is not evaluated again', async () => {
  mockAlertStore.push({
    id: 'alt_already_triggered',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 999999,
    initialPrice: 75000,
    currentPrice: 65000,
    isActive: false,
    isTriggered: true
  });

  const summary = await alertTriggerService.evaluateActiveAlerts();
  assert.equal(summary.checked, 0);
  assert.equal(summary.triggered, 0);
});

test('8. Trigger update fields check: isTriggered=true, isActive=false, currentPrice, triggeredAt, lastCheckedAt', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 64000,
    bestDeal: { price: 64000, store: 'Flipkart' },
    offers: [{ store: 'Flipkart', price: 64000, isAvailable: true }]
  });

  try {
    mockAlertStore.push({
      id: 'alt_fields_check',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: null,
      targetPrice: 65000,
      initialPrice: 75000,
      currentPrice: 70000,
      isActive: true,
      isTriggered: false
    });

    const summary = await alertTriggerService.evaluateActiveAlerts();
    assert.equal(summary.triggered, 1);
    const item = mockAlertStore[0];
    assert.equal(item.isTriggered, true);
    assert.equal(item.isActive, false);
    assert.equal(item.currentPrice, 64000);
    assert.ok(item.triggeredAt instanceof Date);
    assert.ok(item.lastCheckedAt instanceof Date);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('9. initialPrice remains unchanged upon trigger', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 64000,
    bestDeal: { price: 64000, store: 'Flipkart' },
    offers: [{ store: 'Flipkart', price: 64000, isAvailable: true }]
  });

  try {
    mockAlertStore.push({
      id: 'alt_initial_price',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: null,
      targetPrice: 65000,
      initialPrice: 79999,
      currentPrice: 70000,
      isActive: true,
      isTriggered: false
    });

    await alertTriggerService.evaluateActiveAlerts();
    assert.equal(mockAlertStore[0].initialPrice, 79999);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('10. targetPrice remains unchanged upon trigger', async () => {
  const originalCompare = comparisonService.compareByProductId;
  comparisonService.compareByProductId = async () => ({
    lowestPrice: 64000,
    bestDeal: { price: 64000, store: 'Flipkart' },
    offers: [{ store: 'Flipkart', price: 64000, isAvailable: true }]
  });

  try {
    mockAlertStore.push({
      id: 'alt_target_price',
      userId: 'usr_1',
      productId: 'iphone-16-128',
      store: null,
      targetPrice: 65000,
      initialPrice: 79999,
      currentPrice: 70000,
      isActive: true,
      isTriggered: false
    });

    await alertTriggerService.evaluateActiveAlerts();
    assert.equal(mockAlertStore[0].targetPrice, 65000);
  } finally {
    comparisonService.compareByProductId = originalCompare;
  }
});

test('11. Database failure must NOT result in fake success', async () => {
  const originalFindMany = prisma.priceAlert.findMany;
  prisma.priceAlert.findMany = async () => {
    const dbErr = new Error("Can't reach database server at localhost:5432");
    dbErr.code = 'P1001';
    throw dbErr;
  };

  try {
    await assert.rejects(
      async () => {
        await alertTriggerService.evaluateActiveAlerts();
      },
      (err) => {
        assert.equal(err.code, 'P1001');
        assert.match(err.message, /localhost:5432/);
        return true;
      }
    );
  } finally {
    prisma.priceAlert.findMany = originalFindMany;
  }
});

test('12. evaluateActiveAlerts({ userId }) -> evaluates ONLY active alerts belonging to that user', async () => {
  mockAlertStore.push({
    id: 'alt_usr_1',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  mockAlertStore.push({
    id: 'alt_usr_2',
    userId: 'usr_2',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const summary = await alertTriggerService.evaluateActiveAlerts({ userId: 'usr_1' });
  assert.equal(summary.checked, 1);
  assert.equal(summary.triggered, 1);
  assert.equal(summary.triggeredAlerts.length, 1);
  assert.equal(summary.triggeredAlerts[0].userId, 'usr_1');

  assert.equal(mockAlertStore[0].isTriggered, true);
  assert.equal(mockAlertStore[1].isTriggered, false);
});

test('13. evaluateActiveAlerts({ userId }) -> excludes other users when evaluating alerts', async () => {
  mockAlertStore.push({
    id: 'alt_usr_1',
    userId: 'usr_1',
    productId: 'iphone-16-128',
    store: null,
    targetPrice: 70000,
    initialPrice: 79999,
    currentPrice: 75000,
    isActive: true,
    isTriggered: false
  });

  const summary = await alertTriggerService.evaluateActiveAlerts({ userId: 'usr_non_existent' });
  assert.equal(summary.checked, 0);
  assert.equal(summary.triggered, 0);
  assert.equal(summary.triggeredAlerts.length, 0);
  assert.equal(mockAlertStore[0].isTriggered, false);
});
