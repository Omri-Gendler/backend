import { logger } from '../../services/logger.service.js'
import { youtubeService } from '../../services/youtube.service.js'

export async function searchVideos(req, res) {
    try {
        const { 
            q: query, 
            maxResults = 25, 
            order = 'relevance',
            type = 'video',
            ...otherParams 
        } = req.query
        
        if (!query) {
            return res.status(400).json({ 
                error: 'Query parameter "q" is required' 
            })
        }

        const options = {
            maxResults: parseInt(maxResults),
            order,
            type,
            ...otherParams
        }

        const results = await youtubeService.searchVideos(query, options)
        
        res.json({
            success: true,
            data: results,
            cached: results._fromCache || false,
            query: {
                q: query,
                maxResults: options.maxResults,
                order: options.order
            }
        })
        
    } catch (err) {
        logger.error('Failed to search YouTube videos', err)
        res.status(500).json({ 
            error: 'Failed to search videos',
            message: err.message 
        })
    }
}

export async function getVideoDetails(req, res) {
    try {
        const { id } = req.params
        const { part = 'snippet,statistics,contentDetails' } = req.query
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Video ID is required' 
            })
        }

        const options = { part }
        const results = await youtubeService.getVideoDetails(id, options)
        
        res.json({
            success: true,
            data: results,
            cached: results._fromCache || false,
            videoId: id
        })
        
    } catch (err) {
        logger.error('Failed to get YouTube video details', err)
        res.status(500).json({ 
            error: 'Failed to get video details',
            message: err.message 
        })
    }
}

export async function getPlaylistDetails(req, res) {
    try {
        const { id } = req.params
        const { part = 'snippet,contentDetails' } = req.query
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Playlist ID is required' 
            })
        }

        const options = { part }
        const results = await youtubeService.getPlaylistDetails(id, options)
        
        res.json({
            success: true,
            data: results,
            cached: results._fromCache || false,
            playlistId: id
        })
        
    } catch (err) {
        logger.error('Failed to get YouTube playlist details', err)
        res.status(500).json({ 
            error: 'Failed to get playlist details',
            message: err.message 
        })
    }
}

export async function getPlaylistItems(req, res) {
    try {
        const { id } = req.params
        const { 
            part = 'snippet,contentDetails',
            maxResults = 50,
            pageToken 
        } = req.query
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Playlist ID is required' 
            })
        }

        const options = { 
            part,
            maxResults: parseInt(maxResults),
            pageToken
        }
        
        const results = await youtubeService.getPlaylistItems(id, options)
        
        res.json({
            success: true,
            data: results,
            cached: results._fromCache || false,
            playlistId: id,
            maxResults: options.maxResults
        })
        
    } catch (err) {
        logger.error('Failed to get YouTube playlist items', err)
        res.status(500).json({ 
            error: 'Failed to get playlist items',
            message: err.message 
        })
    }
}

export async function clearCache(req, res) {
    try {
        const clearedCount = youtubeService.clearCache()
        
        res.json({
            success: true,
            message: `YouTube cache cleared`,
            clearedEntries: clearedCount
        })
        
    } catch (err) {
        logger.error('Failed to clear YouTube cache', err)
        res.status(500).json({ 
            error: 'Failed to clear cache',
            message: err.message 
        })
    }
}

export async function getCacheStats(req, res) {
    try {
        const stats = youtubeService.getCacheStats()
        
        res.json({
            success: true,
            data: stats
        })
        
    } catch (err) {
        logger.error('Failed to get YouTube cache stats', err)
        res.status(500).json({ 
            error: 'Failed to get cache stats',
            message: err.message 
        })
    }
}