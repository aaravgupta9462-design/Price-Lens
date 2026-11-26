import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../src/middlewares/auth.middleware.js';
import { config } from '../src/config/env.js';
import prisma from '../src/config/db.js';

const createMockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

test('1. Missing Authorization header -> 401', async () => {
  const req = { headers: {} };
  const res = createMockRes();
  let nextCalled = false;

  await authenticateUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'UNAUTHORIZED');
  assert.match(res.body.message, /missing/i);
});

test('2. Invalid token -> 401', async () => {
  const req = { headers: { authorization: 'Bearer invalid_bogus_token_xyz' } };
  const res = createMockRes();
  let nextCalled = false;

  await authenticateUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'UNAUTHORIZED');
  assert.match(res.body.message, /invalid/i);
});

test('3. Expired token -> 401', async () => {
  const expiredToken = jwt.sign(
    { id: 'usr_test_123', email: 'test@example.com' },
    config.jwtSecret,
    { expiresIn: '-1s' }
  );

  const req = { headers: { authorization: `Bearer ${expiredToken}` } };
  const res = createMockRes();
  let nextCalled = false;

  await authenticateUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'UNAUTHORIZED');
  assert.match(res.body.message, /expired/i);
});

test('4. Valid token with existing user -> request.user populated', async () => {
  const validToken = jwt.sign(
    { id: 'usr_valid_mock_1', email: 'valid@example.com', fullName: 'Valid User' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const req = { headers: { authorization: `Bearer ${validToken}` } };
  const res = createMockRes();
  let nextCalled = false;

  await authenticateUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.ok(req.user);
  assert.equal(req.user.id, 'usr_valid_mock_1');
  assert.equal(req.user.email, 'valid@example.com');
});

test('5. Valid token for deleted/nonexistent user -> 401', async () => {
  if (prisma) {
    const nonexistentToken = jwt.sign(
      { id: 'non_existent_uuid_999999', email: 'deleted@example.com' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const req = { headers: { authorization: `Bearer ${nonexistentToken}` } };
    const res = createMockRes();
    let nextCalled = false;

    const originalFindUnique = prisma.user.findUnique;
    prisma.user.findUnique = async () => null;

    try {
      await authenticateUser(req, res, () => {
        nextCalled = true;
      });

      assert.equal(nextCalled, false);
      assert.equal(res.statusCode, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error, 'UNAUTHORIZED');
      assert.match(res.body.message, /no longer exists/i);
    } finally {
      prisma.user.findUnique = originalFindUnique;
    }
  }
});
