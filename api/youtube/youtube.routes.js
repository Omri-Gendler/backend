import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { 
    searchVideos, 
    getVideoDetails, 
    getPlaylistDetails, 
    getPlaylistItems,
    clearCache,
    getCacheStats
} from './youtube.controller.js'

const router = express.Router()

// Public routes (no auth required for YouTube data)
router.get('/search', log, searchVideos)
router.get('/video/:id', log, getVideoDetails)
router.get('/playlist/:id', log, getPlaylistDetails)
router.get('/playlist/:id/items', log, getPlaylistItems)

// Admin/Auth routes for cache management
router.delete('/cache', requireAuth, clearCache)
router.get('/cache/stats', log, getCacheStats)

export const youtubeRoutes = router