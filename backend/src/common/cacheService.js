/**
 * Cache Service & Circuit Breaker Utility
 * Provides in-memory caching with TTL, request deduplication, and circuit breaker.
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.circuitBreakers = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 600) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  clear() {
    this.cache.clear();
  }

  // Circuit Breaker helper
  isCircuitOpen(storeCode) {
    const cb = this.circuitBreakers.get(storeCode);
    if (!cb) return false;
    if (Date.now() > cb.resetAt) {
      this.circuitBreakers.delete(storeCode);
      return false;
    }
    return cb.failures >= 3;
  }

  recordFailure(storeCode) {
    const cb = this.circuitBreakers.get(storeCode) || { failures: 0, resetAt: 0 };
    cb.failures += 1;
    cb.resetAt = Date.now() + 60 * 1000; // 1 minute cooldown
    this.circuitBreakers.set(storeCode, cb);
  }

  recordSuccess(storeCode) {
    this.circuitBreakers.delete(storeCode);
  }
}

export const cacheService = new CacheService();
