import { cacheService } from './cache.service.js'
import { logger } from './logger.service.js'

export class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY
        this.baseURL = 'https://www.googleapis.com/youtube/v3'
        
        if (!this.apiKey) {
            logger.warn('YouTube API key not found in environment variables')
        }
    }

    /**
     * Search for videos with caching
     * @param {string} query - Search query
     * @param {object} options - Search options
     * @returns {Promise<object>} Search results
     */
    async searchVideos(query, options = {}) {
        const params = {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: options.maxResults || 25,
            order: options.order || 'relevance',
            ...options
        }

        const cacheKey = cacheService.generateYouTubeKey('search', params)
        
        // Try to get from cache first
        const cachedResult = cacheService.get(cacheKey)
        if (cachedResult) {
            logger.info(`YouTube search cache hit for query: "${query}"`)
            return cachedResult
        }

        try {
            // Make API call
            logger.info(`YouTube API call for search: "${query}"`)
            const url = new URL(`${this.baseURL}/search`)
            url.searchParams.append('key', this.apiKey)
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString())
                }
            })

            const response = await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            
            // Cache the result for 1 hour
            cacheService.set(cacheKey, data, 60 * 60 * 1000)
            
            logger.info(`YouTube search successful for query: "${query}" (${data.items?.length || 0} results)`)
            return data

        } catch (error) {
            logger.error('YouTube search failed:', error)
            throw error
        }
    }

    /**
     * Get video details with caching
     * @param {string|string[]} videoIds - Video ID(s)
     * @param {object} options - Request options
     * @returns {Promise<object>} Video details
     */
    async getVideoDetails(videoIds, options = {}) {
        const ids = Array.isArray(videoIds) ? videoIds.join(',') : videoIds
        const params = {
            part: options.part || 'snippet,statistics,contentDetails',
            id: ids,
            ...options
        }

        const cacheKey = cacheService.generateYouTubeKey('videos', params)
        
        // Try to get from cache first
        const cachedResult = cacheService.get(cacheKey)
        if (cachedResult) {
            logger.info(`YouTube video details cache hit for IDs: ${ids}`)
            return cachedResult
        }

        try {
            // Make API call
            logger.info(`YouTube API call for video details: ${ids}`)
            const url = new URL(`${this.baseURL}/videos`)
            url.searchParams.append('key', this.apiKey)
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString())
                }
            })

            const response = await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            
            // Cache the result for 2 hours (video details change less frequently)
            cacheService.set(cacheKey, data, 2 * 60 * 60 * 1000)
            
            logger.info(`YouTube video details successful for IDs: ${ids}`)
            return data

        } catch (error) {
            logger.error('YouTube video details failed:', error)
            throw error
        }
    }

    /**
     * Get playlist details with caching
     * @param {string} playlistId - Playlist ID
     * @param {object} options - Request options
     * @returns {Promise<object>} Playlist details
     */
    async getPlaylistDetails(playlistId, options = {}) {
        const params = {
            part: options.part || 'snippet,contentDetails',
            id: playlistId,
            ...options
        }

        const cacheKey = cacheService.generateYouTubeKey('playlists', params)
        
        // Try to get from cache first
        const cachedResult = cacheService.get(cacheKey)
        if (cachedResult) {
            logger.info(`YouTube playlist cache hit for ID: ${playlistId}`)
            return cachedResult
        }

        try {
            // Make API call
            logger.info(`YouTube API call for playlist: ${playlistId}`)
            const url = new URL(`${this.baseURL}/playlists`)
            url.searchParams.append('key', this.apiKey)
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString())
                }
            })

            const response = await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            
            // Cache the result for 4 hours (playlists change less frequently)
            cacheService.set(cacheKey, data, 4 * 60 * 60 * 1000)
            
            logger.info(`YouTube playlist details successful for ID: ${playlistId}`)
            return data

        } catch (error) {
            logger.error('YouTube playlist details failed:', error)
            throw error
        }
    }

    /**
     * Get playlist items with caching
     * @param {string} playlistId - Playlist ID
     * @param {object} options - Request options
     * @returns {Promise<object>} Playlist items
     */
    async getPlaylistItems(playlistId, options = {}) {
        const params = {
            part: options.part || 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: options.maxResults || 50,
            ...options
        }

        const cacheKey = cacheService.generateYouTubeKey('playlistItems', params)
        
        // Try to get from cache first
        const cachedResult = cacheService.get(cacheKey)
        if (cachedResult) {
            logger.info(`YouTube playlist items cache hit for playlist: ${playlistId}`)
            return cachedResult
        }

        try {
            // Make API call
            logger.info(`YouTube API call for playlist items: ${playlistId}`)
            const url = new URL(`${this.baseURL}/playlistItems`)
            url.searchParams.append('key', this.apiKey)
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString())
                }
            })

            const response = await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            
            // Cache the result for 1 hour
            cacheService.set(cacheKey, data, 60 * 60 * 1000)
            
            logger.info(`YouTube playlist items successful for playlist: ${playlistId} (${data.items?.length || 0} items)`)
            return data

        } catch (error) {
            logger.error('YouTube playlist items failed:', error)
            throw error
        }
    }

    /**
     * Clear YouTube cache
     */
    clearCache() {
        // Get all YouTube cache keys and delete them
        const stats = cacheService.getStats()
        let clearedCount = 0
        
        for (const key of cacheService.cache.keys()) {
            if (key.startsWith('youtube:')) {
                cacheService.delete(key)
                clearedCount++
            }
        }
        
        logger.info(`YouTube cache cleared: ${clearedCount} entries removed`)
        return clearedCount
    }

    /**
     * Get YouTube cache statistics
     */
    getCacheStats() {
        const allStats = cacheService.getStats()
        let youtubeEntries = 0
        
        for (const key of cacheService.cache.keys()) {
            if (key.startsWith('youtube:')) {
                youtubeEntries++
            }
        }
        
        return {
            ...allStats,
            youtubeEntries
        }
    }
}

// Export singleton instance
export const youtubeService = new YouTubeService()