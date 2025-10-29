import { ObjectId } from 'mongodb';
import { logger } from '../../services/logger.service.js';
import { stationService } from './station.service.js';

export async function getStations(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minSpeed: +req.query.minSpeed || 0,
            sortField: req.query.sortField || '',
            sortDir: req.query.sortDir || 1,
            pageIdx: req.query.pageIdx,
        };
        const stations = await stationService.query(filterBy)
        res.json(stations)
    } catch (err) {
        logger.error('Failed to get stations', err)
        res.status(400).send({ err: 'Failed to get stations' })
    }
}

export async function getStationById(req, res) {
    try {
        const stationId = req.params.id;
        const station = await stationService.getById(stationId)
        res.json(station)
    } catch (err) {
        logger.error('Failed to get station', err)
        res.status(400).send({ err: 'Failed to get station' })
    }
}

export async function addStation(req, res) {
    logger.info('--- Inside addStation controller ---');
    const { loggedinUser } = req;
    const { name, description, imgUrl, songs, tags } = req.body

    if (!loggedinUser || !loggedinUser._id) {
        logger.error('addStation called without loggedinUser')
        return res.status(401).send({ err: 'Not Authenticated' })
    }

    const stationToAdd = {
        name: name || 'Unnamed Station',
        description: description || '',
        imgUrl: imgUrl || '/img/unnamed-song.png',
        songs: Array.isArray(songs) ? songs : [],
        tags: Array.isArray(tags) ? tags : [],
        owner: {
            _id: ObjectId.createFromHexString(loggedinUser._id),
            fullname: loggedinUser.fullname || 'Unknown User'
        },
        likedByUsers: [],
    };
    logger.info('Station object to add:', JSON.stringify(stationToAdd))

    try {
        logger.info('Calling stationService.add...');
        const addedStation = await stationService.add(stationToAdd)
        logger.info('stationService.add finished, addedStation._id:', addedStation?._id?.toString())
        logger.info('Attempting to send response...')
        res.status(201).json(addedStation)
        logger.info('--- Response sent successfully from addStation controller ---')
    } catch (err) {
        logger.error('Failed to add station in controller', err)
        if (!res.headersSent) {
            res.status(500).send({ err: 'Failed to add station' })
        }
    }
}

export async function updateStation(req, res) {
    const { loggedinUser, body: stationFromFrontend } = req
    const { _id: userId, isAdmin } = loggedinUser
    const stationId = req.params.id

    const stationToUpdate = {
        _id: stationId,
        name: stationFromFrontend.name,
        description: stationFromFrontend.description,
        imgUrl: stationFromFrontend.imgUrl,
    }

    try {
        logger.info(`Attempting to get station ${stationId} for update...`)
        const originalStation = await stationService.getById(stationId)

        if (!originalStation) {
            logger.warn(`Station not found: ${stationId}`)
            return res.status(404).send({ err: 'Station not found' })
        }
        logger.info(`Found station: ${originalStation.name}. Checking permissions...`)

        const ownerId = originalStation.owner?._id?.toString()
        const creatorId = originalStation.createdBy?._id?.toString()
        const currentUserId = userId.toString()
        const isOwner = (ownerId && ownerId === currentUserId)
        const isCreator = (creatorId && creatorId === currentUserId)

        logger.info(`Permission check: isAdmin(${isAdmin}), isOwner(${isOwner}), isCreator(${isCreator}), UserID(${currentUserId})`)

        if (!isAdmin && !isOwner && !isCreator) {
            logger.warn(`User ${currentUserId} attempted to update station ${stationId} without permission.`)
            return res.status(403).send({ err: 'Not authorized to update this station' })
        }

        logger.info(`Permissions OK. Calling stationService.update for ${stationId}`)
        const updatedStationResult = await stationService.update(stationToUpdate)
        logger.info(`Station ${stationId} updated successfully.`)
        res.json(updatedStationResult)

    } catch (err) {
        logger.error(`Failed to update station ${stationId}`, err)
        if (!res.headersSent) {
            res.status(500).send({ err: 'Failed to update station due to internal error' })
        }
    }
}

export async function removeStation(req, res) {
    try {
        const stationId = req.params.id
        const removedId = await stationService.remove(stationId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove station', err)
        res.status(400).send({ err: 'Failed to remove station' })
    }
}

export async function addStationMsg(req, res) {
    const { loggedinUser } = req
    try {
        const stationId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await stationService.addStationMsg(stationId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to add station msg', err)
        res.status(400).send({ err: 'Failed to add station msg' })
    }
}

export async function removeStationMsg(req, res) {
    try {
        const { id: stationId, msgId } = req.params
        const removedId = await stationService.removeStationMsg(stationId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove station msg', err)
        res.status(400).send({ err: 'Failed to remove station msg' })
    }
}

export async function addSongToStation(req, res) {
    const { loggedinUser } = req
    const { id: stationId } = req.params
    const songToAdd = req.body

    if (!songToAdd || !songToAdd.id || !songToAdd.title) {
        logger.error('Attempted to add invalid song data', songToAdd)
        return res.status(400).send({ err: 'Invalid song data provided' })
    }

    try {
        logger.info(`Attempting to add song ${songToAdd.id} to station ${stationId} by user ${loggedinUser._id}`)
        const songWithMeta = {
            ...songToAdd,
            addedBy: {
                _id: ObjectId.createFromHexString(loggedinUser._id),
                fullname: loggedinUser.fullname
            },
            addedAt: Date.now()
        };

        const updatedStation = await stationService.addSong(stationId, songWithMeta, loggedinUser)
        logger.info(`Song ${songToAdd.id} added successfully to station ${stationId}`)
        res.json(updatedStation)
    } catch (err) {
        if (err.message === 'Not authorized' || err.message === 'Station not found') {
            logger.error(`Failed to add song: ${err.message}. User: ${loggedinUser._id}, Station: ${stationId}`)
            return res.status(403).send({ err: err.message })
        }
        if (err.message === 'Song already exists in station') {
            logger.warn(`Song ${songToAdd.id} already exists in station ${stationId}`)
            const currentStation = await stationService.getById(stationId)
            return res.status(200).json(currentStation)
        }
        logger.error(`Failed to add song to station ${stationId}`, err)
        res.status(500).send({ err: 'Failed to add song' })
    }
}

export async function removeSongFromStation(req, res) {
    const { loggedinUser } = req;
    const { id: stationId, songId } = req.params

    if (!songId) {
        return res.status(400).send({ err: 'Missing songId parameter' })
    }

    try {
        logger.info(`Attempting to remove song ${songId} from station ${stationId} by user ${loggedinUser._id}`)
        const updatedStation = await stationService.removeSong(stationId, songId, loggedinUser)
        logger.info(`Song ${songId} removed successfully from station ${stationId}`)
        res.json(updatedStation)
    } catch (err) {
        if (err.message === 'Not authorized' || err.message === 'Station not found' || err.message === 'Song not found in station') {
            logger.error(`Failed to remove song: ${err.message}. User: ${loggedinUser._id}, Station: ${stationId}, Song: ${songId}`)
            return res.status(403).send({ err: err.message })
        }
        logger.error(`Failed to remove song ${songId} from station ${stationId}`, err)
        res.status(500).send({ err: 'Failed to remove song' })
    }
}

export async function likeStation(req, res) {
    const { loggedinUser } = req;
    const { id: stationId } = req.params
    try {
        const updatedStation = await stationService.addLike(stationId, loggedinUser._id)
        res.json(updatedStation)
    } catch (err) {
        logger.error(`Failed to like station ${stationId} by user ${loggedinUser._id}`, err)
        if (err.message === 'Station not found') {
            return res.status(404).send({ err: err.message })
        }
        res.status(500).send({ err: 'Failed to like station' })
    }
}

export async function unlikeStation(req, res) {
    const { loggedinUser } = req
    const { id: stationId } = req.params
    try {
        const updatedStation = await stationService.removeLike(stationId, loggedinUser._id)
        res.json(updatedStation)
    } catch (err) {
        logger.error(`Failed to unlike station ${stationId} by user ${loggedinUser._id}`, err)
        if (err.message === 'Station not found') {
            return res.status(404).send({ err: err.message })
        }
        res.status(500).send({ err: 'Failed to unlike station' })
    }
}
