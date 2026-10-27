/**
 * In-Memory TTL Cache with Redis-Ready Interface
 * 
 * Provides an asynchronous key-value cache layer with automatic TTL expiration.
 * Designed so that replacing this with a Redis client (e.g. ioredis) in production
 * requires zero changes to consumer code.
 */
export class MemoryCache {
  constructor(defaultTtlSeconds = 600) {
    this.defaultTtlMs = defaultTtlSeconds * 1000;
    this.store = new Map();

    // Periodic sweep every 5 minutes to prevent memory leaks from abandoned keys
    this.cleanupInterval = setInterval(() => {
      this.evictExpired();
    }, 5 * 60 * 1000);

    // Prevent interval from keeping the process alive during tests or shutdown
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Retrieve item from cache
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    if (!key) return null;
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set item in cache with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} [ttlSeconds] - TTL in seconds (defaults to constructor default)
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttlSeconds) {
    if (!key) return false;
    const ttlMs = (ttlSeconds != null ? ttlSeconds : this.defaultTtlMs / 1000) * 1000;
    const expiresAt = Date.now() + ttlMs;

    this.store.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });

    return true;
  }

  /**
   * Check if a valid, unexpired key exists
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async has(key) {
    const val = await this.get(key);
    return val !== null;
  }

  /**
   * Delete item from cache
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async del(key) {
    if (!key) return false;
    return this.store.delete(key);
  }

  /**
   * Clear all items from cache
   * @returns {Promise<void>}
   */
  async flush() {
    this.store.clear();
  }

  /**
   * Remove all expired entries
   */
  evictExpired() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Cache telemetry
   */
  getStats() {
    return {
      size: this.store.size,
      defaultTtlSeconds: this.defaultTtlMs / 1000
    };
  }
}

// Singleton cache instance (10 min = 600s TTL default)
export const cacheService = new MemoryCache(600);
export default cacheService;
