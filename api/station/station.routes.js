import express from 'express';
import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { log } from '../../middlewares/logger.middleware.js';

// ודא שכל הפונקציות מיובאות מהקונטרולר הנכון (./station.controller.js)
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
} from './station.controller.js'; // <-- הייבוא הוא מהקובץ באותה תיקייה

const router = express.Router();

// נתיבים כלליים לתחנות
router.get('/', log, getStations);
router.get('/:id', log, getStationById);
router.post('/', log, requireAuth, addStation);
router.put('/:id', requireAuth, updateStation);
router.delete('/:id', requireAuth, removeStation);

// נתיבים להודעות
router.post('/:id/msg', requireAuth, addStationMsg);
router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg); // ודא שגם זה לא בהערה אם אתה משתמש

// נתיבים לשירים
router.post('/:id/song', requireAuth, addSongToStation);
router.delete('/:id/song/:songId', requireAuth, removeSongFromStation);

// נתיבים ללייק/אנלייק לתחנה
router.post('/:id/like', requireAuth, likeStation);
router.delete('/:id/like', requireAuth, unlikeStation);

export const stationRoutes = router;