import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

export const socketService = {
    setupSocketAPI,
    emitTo,
    emitToUser,
    broadcast,
}


export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })

        socket.on('station-join', stationId => {
            if (socket.stationId === stationId) return;
            if (socket.stationId) {
                socket.leave(socket.stationId)
                logger.info(`Socket [id: ${socket.id}] left station room ${socket.stationId}`)
            }
            socket.join(stationId)
            socket.stationId = stationId
            logger.info(`Socket [id: ${socket.id}] joined station room ${stationId}`)
        })

        socket.on('station-leave', stationId => {
            if (socket.stationId === stationId) {
                socket.leave(stationId)
                logger.info(`Socket [id: ${socket.id}] left station room ${stationId}`)
                delete socket.stationId
            }
        })
        socket.on('station-send-play', ({ stationId, index, song }) => {
            logger.info(`Socket [id: ${socket.id}] sent play event for station ${stationId}, index ${index}`)
            socket.broadcast.to(stationId).emit('station-receive-play', { stationId, index, song })
        })

        socket.on('station-send-pause', (stationId) => {
            logger.info(`Socket [id: ${socket.id}] sent pause event for station ${stationId}`)
            socket.broadcast.to(stationId).emit('station-receive-pause', { stationId })
        })

        socket.on('chat-set-topic', topic => {
            if (socket.myTopic === topic) return
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
                logger.info(`Socket is leaving topic ${socket.myTopic} [id: ${socket.id}]`)
            }
            socket.join(topic)
            socket.myTopic = topic
        })
        socket.on('chat-send-msg', msg => {
            logger.info(`New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
            gIo.to(socket.myTopic).emit('chat-add-msg', msg)
        })
        socket.on('user-watch', userId => {
            logger.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`)
            socket.join('watching:' + userId)
        })
        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })

    })
    console.log('--- handleReceivePlay END ---')
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
    }
}

async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}


