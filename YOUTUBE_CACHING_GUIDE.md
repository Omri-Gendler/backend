# 🎬 YouTube API with Caching System

## 🚀 Features

✅ **Smart Caching** - Automatic caching with configurable TTL (Time To Live)  
✅ **Memory Efficient** - Automatic cleanup of expired entries  
✅ **Cache Statistics** - Monitor cache performance  
✅ **Multiple Cache Durations** - Different TTL for different API calls:
- Search Results: 1 hour
- Video Details: 2 hours  
- Playlist Details: 4 hours
- Playlist Items: 1 hour

## 📋 API Endpoints

### Search Videos
```http
GET /api/youtube/search?q=YOUR_QUERY&maxResults=25&order=relevance
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pageInfo": {...}
  },
  "cached": true,
  "query": {
    "q": "javascript tutorial",
    "maxResults": 25,
    "order": "relevance"
  }
}
```

### Get Video Details
```http
GET /api/youtube/video/VIDEO_ID?part=snippet,statistics,contentDetails
```

### Get Playlist Details
```http
GET /api/youtube/playlist/PLAYLIST_ID?part=snippet,contentDetails
```

### Get Playlist Items
```http
GET /api/youtube/playlist/PLAYLIST_ID/items?maxResults=50
```

### Cache Management

#### Get Cache Statistics
```http
GET /api/youtube/cache/stats
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalEntries": 15,
    "expiredEntries": 2,
    "activeEntries": 13,
    "memoryUsage": "125.32 KB",
    "youtubeEntries": 8
  }
}
```

#### Clear Cache (Requires Authentication)
```http
DELETE /api/youtube/cache
```

## 🔧 Environment Variables

Add to your `.env` file:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 📊 Cache Strategy

### Cache Keys
- **Search**: `youtube:search:{"q":"query","maxResults":25}`
- **Video Details**: `youtube:videos:{"id":"VIDEO_ID","part":"snippet"}`
- **Playlists**: `youtube:playlists:{"id":"PLAYLIST_ID","part":"snippet"}`

### TTL (Time To Live)
- **Search Results**: 1 hour (frequently changing)
- **Video Details**: 2 hours (semi-static)
- **Playlist Details**: 4 hours (rarely changing)
- **Playlist Items**: 1 hour (can change)

### Auto-Cleanup
- Expired entries are automatically removed every 10 minutes
- Memory usage is monitored and reported
- Cache statistics are logged hourly in development

## 💡 Usage Examples

### JavaScript/React Frontend
```javascript
// Search for videos (cached automatically)
const searchResults = await fetch('/api/youtube/search?q=javascript+tutorial&maxResults=10')
const data = await searchResults.json()

if (data.cached) {
  console.log('Result served from cache! ⚡')
} else {
  console.log('Fresh API call made 🌐')
}

// Get video details
const videoDetails = await fetch('/api/youtube/video/dQw4w9WgXcQ')
const videoData = await videoDetails.json()
```

### Node.js Backend Usage
```javascript
import { youtubeService } from './services/youtube.service.js'

// All calls automatically use caching
const results = await youtubeService.searchVideos('music', { maxResults: 20 })
const videoDetails = await youtubeService.getVideoDetails('VIDEO_ID')
const playlistItems = await youtubeService.getPlaylistItems('PLAYLIST_ID')

// Cache management
const stats = youtubeService.getCacheStats()
console.log('Cache stats:', stats)

youtubeService.clearCache() // Clear all YouTube cache
```

## 🎯 Benefits

1. **Reduced API Calls** - Same requests served from memory
2. **Faster Response Times** - Cached responses are instant
3. **API Quota Management** - Stay within YouTube API limits
4. **Better User Experience** - No waiting for repeated requests
5. **Cost Effective** - Reduce API usage costs

## 🔍 Monitoring

Check cache performance:
```http
GET /api/youtube/cache/stats
```

Monitor logs for cache hits/misses:
```
Cache HIT: youtube:search:{"q":"music"} (age: 15342ms)
Cache MISS: youtube:videos:{"id":"newvideo123"}
Cache SET: youtube:search:{"q":"tutorial"} (TTL: 3600000ms)
```

## 🚀 Deployment Notes

1. **Add YOUTUBE_API_KEY** to your environment variables on Render
2. **Cache is in-memory** - resets on server restart (this is normal)
3. **Free tier limitations** - Cache helps maximize free API quota
4. **Monitoring** - Use cache stats endpoint to monitor performance

Your YouTube API calls are now optimized with intelligent caching! 🎉