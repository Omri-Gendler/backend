import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const stationService = {
    remove,
    query,
    getById,
    add,
    update,
    addSong,
    removeSong,
    addStationMsg,
    removeStationMsg,
    addLike,
    removeLike
}

async function query(filterBy = { txt: '' }) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('station')
        var stationCursor = await collection.find(criteria, { sort })

        if (filterBy.pageIdx !== undefined) {
            stationCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const stations = stationCursor.toArray()
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stationId) }

        const collection = await dbService.getCollection('station')
        const station = await collection.findOne(criteria)

        if (station) {
            station.createdAt = station._id.getTimestamp()
        }
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerIdString, isAdmin } = loggedinUser

    try {
        const criteria = {
            _id: ObjectId.createFromHexString(stationId),
        }

        if (!isAdmin) {
            criteria['owner._id'] = ObjectId.createFromHexString(ownerIdString)
        }

        const collection = await dbService.getCollection('station')
        const res = await collection.deleteOne(criteria)

        if (res.deletedCount === 0) {
            logger.warn(`Remove failed: User ${ownerIdString} (isAdmin: ${isAdmin}) tried to delete ${stationId}. No document matched criteria.`)
            throw ('Not your station or station not found')
        }
        logger.info(`Station ${stationId} removed successfully by user ${ownerIdString}`)
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    logger.info('--- Inside stationService.add ---')
    try {
        const collection = await dbService.getCollection('station')
        logger.info('Got collection, attempting insertOne...')

        logger.info('Attempting to insert full station data:', JSON.stringify(station))
        const result = await collection.insertOne(station)
        logger.info('insertOne successful, result:', JSON.stringify(result))
        logger.info('Returning station object after insert (should have _id):', JSON.stringify(station))
        return station
    } catch (err) {
        logger.error('cannot insert station in service', err)
        throw err
    }
}

async function update(station) {
    const stationToSave = {
        name: station.name,
        description: station.description,
        imgUrl: station.imgUrl
    }

    try {
        const criteria = { _id: ObjectId.createFromHexString(station._id) }

        const collection = await dbService.getCollection('station')
        const updateResult = await collection.updateOne(criteria, { $set: stationToSave })

        if (updateResult.matchedCount === 0) throw new Error('Station not found for update')

        return { ...station, ...stationToSave }
    } catch (err) {
        logger.error(`cannot update station ${station._id}`, err)
        throw err
    }
}

async function addStationMsg(stationId, msg) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stationId) }
        msg.id = makeId()

        const collection = await dbService.getCollection('station')
        await collection.updateOne(criteria, { $push: { msgs: msg } })

        return msg
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

async function removeStationMsg(stationId, msgId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stationId) }

        const collection = await dbService.getCollection('station')
        await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

        return msgId
    } catch (err) {
        logger.error(`cannot remove station msg ${stationId}`, err)
        throw err
    }
}

async function addSong(stationId, song, loggedinUser) {
    try {
        const collection = await dbService.getCollection('station')
        const stationObjectId = ObjectId.createFromHexString(stationId)
        const station = await collection.findOne({ _id: stationObjectId })
        if (!station) throw new Error('Station not found')
        if (!loggedinUser.isAdmin && station.owner?._id?.toString() !== loggedinUser._id.toString()) {
            throw new Error('Not authorized')
        }
        const songExists = station.songs?.some(s => s.id === song.id)
        if (songExists) {
            throw new Error('Song already exists in station')
        }
        const updateResult = await collection.updateOne(
            { _id: stationObjectId },
            { $push: { songs: song } }
        )

        if (updateResult.modifiedCount === 0) {
            throw new Error('Failed to update station with new song')
        }

        const updatedStation = await getById(stationId)
        return updatedStation

    } catch (err) {
        logger.error(`cannot add song ${song.id} to station ${stationId}`, err)
        throw err
    }
}

async function removeSong(stationId, songIdToRemove, loggedinUser) {
    try {
        const collection = await dbService.getCollection('station')
        const stationObjectId = ObjectId.createFromHexString(stationId)

        const station = await collection.findOne({ _id: stationObjectId })
        if (!station) throw new Error('Station not found')
        if (!loggedinUser.isAdmin && station.owner?._id?.toString() !== loggedinUser._id.toString()) {
            throw new Error('Not authorized')
        }

        const songExists = station.songs?.some(s => s.id === songIdToRemove)
        if (!songExists) {
            logger.warn(`Song ${songIdToRemove} not found in station ${stationId} for removal.`)
            return station
        }


        const updateResult = await collection.updateOne(
            { _id: stationObjectId },
            { $pull: { songs: { id: songIdToRemove } } }
        )

        if (updateResult.modifiedCount === 0) {
            logger.warn(`Song ${songIdToRemove} was not removed from station ${stationId}, perhaps it was already gone.`)
        }

        const updatedStation = await getById(stationId)
        return updatedStation

    } catch (err) {
        logger.error(`cannot remove song ${songIdToRemove} from station ${stationId}`, err)
        throw err
    }
}

async function addLike(stationId, userId) {
    try {
        const collection = await dbService.getCollection('station')
        const stationObjectId = ObjectId.createFromHexString(stationId)
        const userObjectId = ObjectId.createFromHexString(userId)

        const updateResult = await collection.updateOne(
            { _id: stationObjectId },
            { $addToSet: { likedByUsers: userObjectId } }
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Station not found')
        }
        const updatedStation = await getById(stationId)
        return updatedStation

    } catch (err) {
        logger.error(`cannot add like to station ${stationId} for user ${userId}`, err)
        throw err;
    }
}

async function removeLike(stationId, userId) {
    try {
        const collection = await dbService.getCollection('station')
        const stationObjectId = ObjectId.createFromHexString(stationId)
        const userObjectId = ObjectId.createFromHexString(userId)

        const updateResult = await collection.updateOne(
            { _id: stationObjectId },
            { $pull: { likedByUsers: userObjectId } }
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Station not found')
        }
        const updatedStation = await getById(stationId)
        return updatedStation;

    } catch (err) {
        logger.error(`cannot remove like from station ${stationId} for user ${userId}`, err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.txt) {
        criteria.$or = [
            { name: { $regex: filterBy.txt, $options: 'i' } },
            { description: { $regex: filterBy.txt, $options: 'i' } }
        ]
    }

    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}
