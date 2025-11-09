# 🎵 Music Streaming Backend API

A full-featured Node.js backend service for a music streaming application with playlist management, YouTube integration, user authentication, and social features. Built with Express.js, MongoDB, and Socket.IO for real-time functionality.

## ✨ Features

- 🎵 **Station Management** - Create, manage, and share music playlists
- 🔍 **YouTube Integration** - Search and stream music from YouTube
- 👤 **User Authentication** - JWT-based authentication with bcrypt encryption
- 💬 **Real-time Chat** - WebSocket-powered messaging for stations
- ❤️ **Social Features** - Like songs, stations, and user reviews
- 📊 **Reviews System** - User rating and review functionality
- 🚀 **Production Ready** - Deployed on Render with MongoDB Atlas

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- YouTube Data API key (optional, for enhanced features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Omri-Gendler/backend.git
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
YOUTUBE_API_KEY=your_youtube_api_key (optional)
```

4. **Seed the database (optional)**
```bash
npm run db:seed
```

5. **Start the server**
```bash
npm run dev     # Development mode with hot reload
npm start       # Production mode
```

The server will run on `http://localhost:3030`

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration  
- `POST /api/auth/logout` - User logout

### 👥 Users API
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user profile (auth required)
- `DELETE /api/user/:id` - Delete user (admin only)
- `GET /api/user/likes` - Get user's liked songs (auth required)
- `POST /api/user/likes` - Add song to user likes (auth required)
- `DELETE /api/user/likes/:songId` - Remove song from likes (auth required)

### 🎵 Stations API
- `GET /api/station` - Get all stations with filtering
- `GET /api/station/:id` - Get station by ID
- `POST /api/station` - Create new station (auth required)
- `PUT /api/station/:id` - Update station (auth required)
- `DELETE /api/station/:id` - Delete station (auth required)
- `POST /api/station/:id/song` - Add song to station (auth required)
- `DELETE /api/station/:id/song/:songId` - Remove song from station (auth required)
- `POST /api/station/:id/msg` - Add message to station (auth required)
- `DELETE /api/station/:id/msg/:msgId` - Remove message (auth required)
- `POST /api/station/:id/like` - Like station (auth required)
- `DELETE /api/station/:id/like` - Unlike station (auth required)

### 📹 YouTube API
- `GET /api/youtube/search` - Search YouTube videos
- `GET /api/youtube/video/:id` - Get video details
- `GET /api/youtube/playlist/:id` - Get playlist details

### ⭐ Reviews API
- `GET /api/review` - Get all reviews
- `POST /api/review` - Create new review (auth required)
- `DELETE /api/review/:id` - Delete review (auth required)

## 🏗️ Project Structure

```
backend/
├── api/
│   ├── auth/           # Authentication routes and controllers
│   ├── user/           # User management and likes
│   ├── station/        # Station/playlist CRUD operations
│   ├── review/         # Review and rating system
│   └── youtube/        # YouTube API integration
├── services/
│   ├── db.service.js       # MongoDB connectivity
│   ├── socket.service.js   # WebSocket functionality  
│   ├── logger.service.js   # Logging utility
│   ├── cache.service.js    # Caching for YouTube API
│   ├── youtube.service.js  # YouTube Data API wrapper
│   └── util.service.js     # Helper functions
├── middlewares/
│   ├── requireAuth.middleware.js   # JWT authentication
│   ├── logger.middleware.js        # Request logging
│   └── setupAls.middleware.js      # Async local storage
├── config/
│   ├── dev.js              # Development configuration
│   ├── prod.js             # Production configuration
│   └── index.js            # Config loader
├── scripts/
│   └── seedDb.js           # Database seeding script
└── public/                 # Static frontend files
```

## 💾 Database Schema

### Station Collection
```js
{
  _id: ObjectId,
  name: String,
  description: String,
  imgUrl: String,
  tags: [String],
  createdBy: {
    _id: ObjectId,
    fullname: String,
    imgUrl: String
  },
  likedByUsers: [ObjectId],
  songs: [{
    id: String,
    title: String,
    url: String,
    imgUrl: String,
    addedBy: Object,
    addedAt: Number
  }],
  msgs: [{
    id: String,
    txt: String,
    by: {
      _id: ObjectId,
      fullname: String,
      imgUrl: String
    },
    at: Number
  }]
}
```

### User Collection
```js
{
  _id: ObjectId,
  username: String,
  password: String, // bcrypt hashed
  fullname: String,
  imgUrl: String,
  isAdmin: Boolean,
  likedSongs: [{
    id: String,
    title: String,
    url: String,
    imgUrl: String
  }]
}
```

### Review Collection
```js
{
  _id: ObjectId,
  txt: String,
  rate: Number, // 1-5 stars
  byUserId: ObjectId,
  aboutUserId: ObjectId,
  createdAt: Date
}
```

## 🔒 Authentication & Security

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Encryption**: Bcrypt hashing for secure password storage
- **Cookies**: HTTP-only cookies for token storage
- **Middleware Protection**: Route-level authentication and authorization
- **Admin Controls**: Role-based access for administrative functions

## 🔌 WebSocket Events

Real-time functionality powered by Socket.IO:

- `station-watch` - Subscribe to station updates
- `station-update` - Station modifications broadcast
- `user-watch` - User status updates
- `chat-new-msg` - New chat messages in stations
- `review-about-you` - New review notifications
- `review-added` - Review created
- `review-removed` - Review deleted

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Development with nodemon hot reload
npm start            # Production server
npm run db:seed      # Populate database with sample data
npm run server:prod  # Windows production mode
npm run atlas        # Deploy to MongoDB Atlas
```

### Error Handling Pattern
```js
try {
  const result = await someAsyncOperation()
  logger.info('Operation successful', { result })
  return result
} catch (err) {
  logger.error('Operation failed', err)
  throw err
}
```

### Adding New Routes
1. Create controller in `api/[module]/[module].controller.js`
2. Define routes in `api/[module]/[module].routes.js`
3. Implement service logic in `api/[module]/[module].service.js`
4. Add route to main server.js

## 📝 Logging

Structured logging with multiple levels stored in `/logs`:
- **DEBUG** - Development information and detailed traces
- **INFO** - General application events and user actions
- **WARN** - Warning conditions that should be monitored
- **ERROR** - Error events requiring immediate attention

## � Production Deployment

### Render Deployment
1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   ```

2. **Build Command**: `npm install`

3. **Start Command**: `npm start`

### MongoDB Atlas Setup
- Create cluster and get connection string
- Whitelist Render IP addresses
- Configure database user permissions

## 🧪 Testing

Import the provided Postman collection:
- `Sprint4-Backend-API.postman_collection.json` - Complete API testing suite
- Test authentication flows
- Validate CRUD operations
- Test real-time features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [MongoDB Atlas Setup Guide](ATLAS_SETUP_GUIDE.md)
- [Render Deployment Guide](RENDER_DEPLOYMENT.md)
- [YouTube Caching Guide](YOUTUBE_CACHING_GUIDE.md)

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

**Built with ❤️ for the Full Stack Development Sprint**
