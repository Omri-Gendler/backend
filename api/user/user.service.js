import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { reviewService } from '../review/review.service.js'

export const userService = {
    add,
    getById,
    update,
    remove,
    query,
    getByUsername,
    getLikedSongs,
    addLikedSong,
    removeLikedSong,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = user._id.getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)

        if (!user) {
            logger.error(`User not found with id: ${userId}`)
            throw new Error(`User not found`)
        }

        delete user.password

        criteria = { byUserId: userId }

        user.givenReviews = await reviewService.query(criteria)
        // console.log(user.givenReviews)

        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })

        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id),
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin,
            score: 100,
            likedSongs: []
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}

async function getLikedSongs(userId) {
    try {
        const userObjectId = ObjectId.createFromHexString(userId)
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: userObjectId }, { projection: { likedSongs: 1 } })
        if (!user) throw new Error('User not found')
        return user.likedSongs || []
    } catch (err) {
        logger.error(`cannot get liked songs for user ${userId}`, err)
        throw err
    }
}

async function addLikedSong(userId, song) {
    try {
        const userObjectId = ObjectId.createFromHexString(userId)
        const collection = await dbService.getCollection('user')

        const user = await collection.findOne({ _id: userObjectId, "likedSongs.id": song.id }, { projection: { _id: 1 } })
        if (user) {
            logger.warn(`Song ${song.id} already liked by user ${userId}`)
            const currentUser = await getLikedSongs(userId);
            return { likedSongs: currentUser };
        }

        const updateResult = await collection.updateOne(
            { _id: userObjectId },
            { $push: { likedSongs: song } }
        )

        if (updateResult.matchedCount === 0) {
            throw new Error('User not found or song not added')
        }

        const updatedUser = await getLikedSongs(userId);
        return { likedSongs: updatedUser || [] }

    } catch (err) {
        logger.error(`cannot add liked song ${song.id} for user ${userId}`, err)
        throw err
    }
}

async function removeLikedSong(userId, songIdToRemove) {
    try {
        const userObjectId = ObjectId.createFromHexString(userId)
        const collection = await dbService.getCollection('user')

        const updateResult = await collection.updateOne(
            { _id: userObjectId },
            { $pull: { likedSongs: { id: songIdToRemove } } }
        )

        if (updateResult.matchedCount === 0) {
            throw new Error('User not found');
        }

        const updatedUser = await getLikedSongs(userId);
        return { likedSongs: updatedUser || [] }

    } catch (err) {
        logger.error(`cannot remove liked song ${songIdToRemove} for user ${userId}`, err)
        throw err
    }
}
