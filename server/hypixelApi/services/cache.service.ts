import NodeCache from 'node-cache';
import {DAY, HOUR, MINUTE} from '../utils/time';

/**
 * This is a class that manages a cache for storing data. It wraps the {@link NodeCache} library.
 */
class CacheManager {
  private cache: NodeCache;

  /**
   * Initializes a new instance of the CacheManager class.
   * @param {number} ttl The time-to-live (TTL) for cache entries in seconds. Default is 1 hour.
   * @param {number} check The interval in seconds to check for expired cache entries. Default is 30 minutes.
   */
  constructor(ttl: number = HOUR, check: number = 0.5 * HOUR) {
    this.cache = new NodeCache({stdTTL: ttl, checkperiod: check});
  }

  /**
   * Set a value in the cache with optional TTL (in seconds).
   * @param key Key to store the value under.
   * @param value Value to store. Can be of any type.
   * @param [ttl] TTL override (in seconds)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    if (ttl) this.cache.set(key, value, ttl)
    else this.cache.set(key, value, 6 * HOUR)
  }

  /**
   * Get a cached value.
   * @param key Key to retrieve the value from.
   * @returns The cached value or undefined
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  /**
   * Check if a key exists.
   * @param key Key to be checked.
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Delete a cache entry.
   * @param key Key to be deleted.
   */
  delete(key: string): void {
    this.cache.del(key)
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.flushAll()
  }
}

// Profiles cache is kept for 1 day, and checked every 8 hours
export const profilesCache = new CacheManager(DAY, 8 * HOUR)

// Profile data cache is kept for 2 hours, and checked every 30 minutes
export const profileDataCache = new CacheManager(2 * HOUR, 30 * MINUTE)