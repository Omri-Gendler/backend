import { httpService } from './http.service.js'
import { getRandomIntInclusive } from './util.service.js'

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    addStationMsg
}
window.ss = stationService

async function query(filterBy = { txt: '' }) {
    return httpService.get('station', filterBy)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)
    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const savedMsg = await httpService.post(`station/${stationId}/msg`, {txt})
    return savedMsg
}

function getEmptyStation() {
    return {
        name: 'Station-' + (Date.now() % 1000),
        location: 'Location-' + getRandomIntInclusive(1, 100),
        capacity: getRandomIntInclusive(10, 100),
    }
}