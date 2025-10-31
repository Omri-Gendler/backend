import { httpService } from './http.service.js'

export const youtubeService = {
    search,
    getVideoDetails,
    getPlaylistDetails,
    getPlaylistItems,
    getCacheStats,
    clearCache
}

window.youtubeService = youtubeService

/**
 * Search YouTube videos
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} Search results
 */
async function search(query, options = {}) {
    const params = {
        q: query,
        maxResults: options.maxResults || 25,
        order: options.order || 'relevance',
        ...options
    }
    
    return httpService.get('youtube/search', params)
}

/**
 * Get video details by ID
 * @param {string} videoId - YouTube video ID
 * @param {object} options - Request options
 * @returns {Promise<object>} Video details
 */
async function getVideoDetails(videoId, options = {}) {
    const params = {
        part: options.part || 'snippet,statistics,contentDetails'
    }
    
    return httpService.get(`youtube/video/${videoId}`, params)
}

/**
 * Get playlist details
 * @param {string} playlistId - YouTube playlist ID
 * @param {object} options - Request options
 * @returns {Promise<object>} Playlist details
 */
async function getPlaylistDetails(playlistId, options = {}) {
    const params = {
        part: options.part || 'snippet,contentDetails'
    }
    
    return httpService.get(`youtube/playlist/${playlistId}`, params)
}

/**
 * Get playlist items
 * @param {string} playlistId - YouTube playlist ID
 * @param {object} options - Request options
 * @returns {Promise<object>} Playlist items
 */
async function getPlaylistItems(playlistId, options = {}) {
    const params = {
        part: options.part || 'snippet,contentDetails',
        maxResults: options.maxResults || 50,
        pageToken: options.pageToken
    }
    
    return httpService.get(`youtube/playlist/${playlistId}/items`, params)
}

/**
 * Get cache statistics
 * @returns {Promise<object>} Cache stats
 */
async function getCacheStats() {
    return httpService.get('youtube/cache/stats')
}

/**
 * Clear YouTube cache (requires authentication)
 * @returns {Promise<object>} Clear result
 */
async function clearCache() {
    return httpService.delete('youtube/cache')
}

// Usage examples:
/*

// Search for videos
const searchResults = await youtubeService.search('javascript tutorial', {
    maxResults: 10,
    order: 'viewCount'
})

// Get video details
const videoDetails = await youtubeService.getVideoDetails('dQw4w9WgXcQ')

// Get playlist details
const playlistDetails = await youtubeService.getPlaylistDetails('PLrAXtmRdnEQy4MUIcb_h0eWrfSGbkKj17')

// Get playlist items
const playlistItems = await youtubeService.getPlaylistItems('PLrAXtmRdnEQy4MUIcb_h0eWrfSGbkKj17', {
    maxResults: 20
})

// Check cache stats
const cacheStats = await youtubeService.getCacheStats()
console.log('Cache stats:', cacheStats)

// Clear cache (admin only)
await youtubeService.clearCache()

*/