import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'
import { logger } from './logger.service.js'

export const dbService = { getCollection }

var dbConn = null

async function getCollection(collectionName) {
    logger.info(`Attempting to get collection: ${collectionName}`)
    try {
        const db = await _connect()
        if (!db) {
             logger.error(`Failed to get DB object from _connect for ${collectionName}. db is null or undefined.`)
             throw new Error('DB connection object is invalid');
        }
        if (typeof db.collection !== 'function') {
             logger.error(`db object received from _connect does not have a "collection" function. Type: ${typeof db}`)
             console.error('Invalid db object:', db);
             throw new Error('DB object does not have collection method');
        }
        logger.info(`Got DB object for ${collectionName}. DB Name: ${db.databaseName}. Proceeding to get collection...`)

        const collection = await db.collection(collectionName)

        if (!collection) {
             logger.error(`db.collection("${collectionName}") returned null or undefined.`)
             throw new Error('Collection object is invalid')
        }
        logger.info(`Successfully got collection object for ${collectionName}. Collection name: ${collection.collectionName}`)

        return collection
    } catch (err) {
        logger.error(`Failed to get Mongo collection "${collectionName}"`, err.message)
        console.error(err)
        throw err
    }
}

async function _connect() {
    if (dbConn) {
        logger.info('Reusing existing DB connection')
        return dbConn
    }
    logger.info('Attempting new DB connection...')
    try {
        const client = await MongoClient.connect(config.dbURL)
        logger.info('Successfully connected to DB')
        return dbConn = client.db(config.dbName)
    } catch (err) {
        logger.error('Cannot Connect to DB in _connect', err)
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}