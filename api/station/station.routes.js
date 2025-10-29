import express from 'express';
import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { log } from '../../middlewares/logger.middleware.js';

import {
    getStations,
    getStationById,
    addStation,
    updateStation,
    removeStation,
    addStationMsg,
    removeStationMsg,
    addSongToStation,
    removeSongFromStation,
    likeStation,
    unlikeStation
} from './station.controller.js'

const router = express.Router()

router.get('/', log, getStations)
router.get('/:id', log, getStationById)
router.post('/', log, requireAuth, addStation)
router.put('/:id', requireAuth, updateStation)
router.delete('/:id', requireAuth, removeStation)

router.post('/:id/msg', requireAuth, addStationMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)

router.post('/:id/song', requireAuth, addSongToStation)
router.delete('/:id/song/:songId', requireAuth, removeSongFromStation)

router.post('/:id/like', requireAuth, likeStation)
router.delete('/:id/like', requireAuth, unlikeStation)

export const stationRoutes = router
