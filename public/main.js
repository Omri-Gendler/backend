import { carService } from './services/car.service.js'
import { stationService } from './services/station.service.js'
import { userService } from './services/user.service.js' 
import { youtubeService } from './services/youtube.service.js'
import { prettyJSON } from './services/util.service.js'

console.log('Simple driver to test some API calls')

window.onLoadStations = onLoadStations
window.onLoadUsers = onLoadUsers
window.onLoadStations = onLoadStations
window.onAddStation = onAddStation
window.onAddStation = onAddStation
window.onGetStationById = onGetStationById
window.onGetStationById = onGetStationById
window.onRemoveStation = onRemoveStation
window.onRemoveStation = onRemoveStation
window.onAddStationMsg = onAddStationMsg
window.onAddStationMsg = onAddStationMsg

async function onLoadStations() {
    const stations = await stationService.query()
    render('Stations', stations)
}

async function onLoadUsers() {
    const users = await userService.query()
    render('Users', users)
}

async function onLoadStations() {
    const stations = await stationService.query()
    render('Stations', stations)
}

async function onGetStationsById() {
    const id = prompt('Stations id?')
    if (!id) return
    const station = await stationService.getById(id)
    render('Stations', station)
}

async function onGetStationById() {
    const id = prompt('Station id?')
    if (!id) return
    const station = await stationService.getById(id)
    render('Station', station)
}

async function onRemoveStation() {
    const id = prompt('Station id?')
    if (!id) return
    await stationService.remove(id)
    render('Removed Station')
}

async function onRemoveStation() {
    const id = prompt('Station id?')
    if (!id) return
    await stationService.remove(id)
    render('Removed Station')
}

async function onAddStation() {
    await userService.login({ username: 'puki', password: '123' })
    const savedStation = await stationService.save(stationService.getEmptyStation())
    render('Saved Station', savedStation)
}

async function onAddStation() {
    await userService.login({ username: 'puki', password: '123' })
    const savedStation = await stationService.save(stationService.getEmptyStation())
    render('Saved Station', savedStation)
}

async function onAddStationMsg() {
    await userService.login({ username: 'puki', password: '123' })
    const id = prompt('Station id?')
    if (!id) return

    const savedMsg = await stationService.addStationMsg(id, 'some msg')
    render('Saved Msg', savedMsg)
}

async function onAddStationMsg() {
    await userService.login({ username: 'puki', password: '123' })
    const id = prompt('Station id?')
    if (!id) return

    const savedMsg = await stationService.addStationMsg(id, 'some station msg')
    render('Saved Station Msg', savedMsg)
}

// YouTube functions
async function onSearchYouTube() {
    const query = prompt('Search query?')
    if (!query) return
    
    const results = await youtubeService.search(query, { maxResults: 10 })
    render('YouTube Search Results', results)
}

async function onGetVideoDetails() {
    const videoId = prompt('YouTube Video ID?')
    if (!videoId) return
    
    const details = await youtubeService.getVideoDetails(videoId)
    render('YouTube Video Details', details)
}

async function onGetCacheStats() {
    const stats = await youtubeService.getCacheStats()
    render('YouTube Cache Statistics', stats)
}

async function onClearCache() {
    await userService.login({ username: 'puki', password: '123' })
    const result = await youtubeService.clearCache()
    render('Cache Cleared', result)
}

window.onSearchYouTube = onSearchYouTube
window.onGetVideoDetails = onGetVideoDetails
window.onGetCacheStats = onGetCacheStats
window.onClearCache = onClearCache

function render(title, mix = '') {
    console.log(title, mix)
    const output = prettyJSON(mix)
    document.querySelector('h2').innerText = title
    document.querySelector('pre').innerHTML = output
}

