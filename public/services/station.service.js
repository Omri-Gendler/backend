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
        title: 'My Playlist ' + (Date.now() % 1000),
        description: 'A great music playlist for any occasion',
        spotifyId: '37i9dQZF1DX' + getRandomIntInclusive(100000, 999999),
        imgUrl: 'https://i.scdn.co/image/ab67706f00000002f2c72a29eafebf594195be53'
    }
}