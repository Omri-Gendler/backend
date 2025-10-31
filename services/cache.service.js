import { logger } from './logger.service.js'

class CacheService {
    constructor() {
        this.cache = new Map()
        this.ttl = new Map() // Time to live for each cache entry
        this.defaultTTL = 30 * 60 * 1000 // Default 30 minutes in milliseconds
    }

    /**
     * Set a value in cache with optional TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttlMs - Time to live in milliseconds (optional)
     */
    set(key, value, ttlMs = this.defaultTTL) {
        const expirationTime = Date.now() + ttlMs
        
        this.cache.set(key, {
            value,
            createdAt: Date.now()
        })
        
        this.ttl.set(key, expirationTime)
        
        logger.debug(`Cache SET: ${key} (TTL: ${ttlMs}ms)`)
        
        // Set timeout to auto-delete expired entry
        setTimeout(() => {
            this.delete(key)
        }, ttlMs)
    }

    /**
     * Get a value from cache if not expired
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found/expired
     */
    get(key) {
        const now = Date.now()
        const expirationTime = this.ttl.get(key)
        
        // Check if key exists and is not expired
        if (!this.cache.has(key) || !expirationTime || now > expirationTime) {
            this.delete(key) // Clean up expired entry
            logger.debug(`Cache MISS: ${key}`)
            return null
        }
        
        const cachedItem = this.cache.get(key)
        logger.debug(`Cache HIT: ${key} (age: ${now - cachedItem.createdAt}ms)`)
        return cachedItem.value
    }

    /**
     * Delete a cache entry
     * @param {string} key - Cache key
     */
    delete(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key)
            this.ttl.delete(key)
            logger.debug(`Cache DELETE: ${key}`)
        }
    }

    /**
     * Check if a key exists in cache and is not expired
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null
    }

    /**
     * Clear all cache entries
     */
    clear() {
        const count = this.cache.size
        this.cache.clear()
        this.ttl.clear()
        logger.info(`Cache cleared: ${count} entries removed`)
    }

    /**
     * Get cache statistics
     * @returns {object} Cache stats
     */
    getStats() {
        const now = Date.now()
        let expiredCount = 0
        
        for (const [key, expirationTime] of this.ttl.entries()) {
            if (now > expirationTime) {
                expiredCount++
            }
        }
        
        return {
            totalEntries: this.cache.size,
            expiredEntries: expiredCount,
            activeEntries: this.cache.size - expiredCount,
            memoryUsage: this._estimateMemoryUsage()
        }
    }

    /**
     * Clean up all expired entries
     */
    cleanup() {
        const now = Date.now()
        let cleanedCount = 0
        
        for (const [key, expirationTime] of this.ttl.entries()) {
            if (now > expirationTime) {
                this.delete(key)
                cleanedCount++
            }
        }
        
        if (cleanedCount > 0) {
            logger.info(`Cache cleanup: ${cleanedCount} expired entries removed`)
        }
        
        return cleanedCount
    }

    /**
     * Estimate memory usage (rough approximation)
     * @private
     */
    _estimateMemoryUsage() {
        let totalSize = 0
        for (const [key, value] of this.cache.entries()) {
            totalSize += key.length * 2 // UTF-16 characters
            totalSize += JSON.stringify(value).length * 2
        }
        return `${(totalSize / 1024).toFixed(2)} KB`
    }

    /**
     * Generate cache key for YouTube API calls
     * @param {string} endpoint - API endpoint
     * @param {object} params - Query parameters
     * @returns {string} Cache key
     */
    generateYouTubeKey(endpoint, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((result, key) => {
                result[key] = params[key]
                return result
            }, {})
        
        return `youtube:${endpoint}:${JSON.stringify(sortedParams)}`
    }

    /**
     * Generate cache key for Spotify API calls  
     * @param {string} endpoint - API endpoint
     * @param {object} params - Query parameters
     * @returns {string} Cache key
     */
    generateSpotifyKey(endpoint, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((result, key) => {
                result[key] = params[key]
                return result
            }, {})
        
        return `spotify:${endpoint}:${JSON.stringify(sortedParams)}`
    }
}

// Create singleton instance
export const cacheService = new CacheService()

// Auto cleanup every 10 minutes
setInterval(() => {
    cacheService.cleanup()
}, 10 * 60 * 1000)

// Log cache stats every hour in development
if (process.env.NODE_ENV !== 'production') {
    setInterval(() => {
        const stats = cacheService.getStats()
        logger.info('Cache Stats:', stats)
    }, 60 * 60 * 1000)
}