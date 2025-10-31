import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { stationRoutes } from './api/station/station.routes.js'
import { youtubeRoutes } from './api/youtube/youtube.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

// Always serve static files
app.use(express.static(path.resolve('public')))

// CORS configuration for both development and production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'https://offbeat-front.onrender.com',
            'https://offbeat-back.onrender.com',
        ];
        
        // Allow any render.com subdomain for development
        if (origin.includes('.onrender.com') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    optionsSuccessStatus: 200 // some legacy browsers choke on 204
}
app.use(cors(corsOptions))

// Handle preflight requests
app.options('*', cors(corsOptions))

// Setup async local storage for request tracking
app.all('*', setupAsyncLocalStorage)

// Debug middleware for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin')} - User-Agent: ${req.get('User-Agent')}`)
        next()
    })
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS: Origin not allowed' });
    }
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Basic health check
        const healthData = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3030,
            uptime: process.uptime(),
            cors: 'enabled'
        };
        
        res.json(healthData);
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
})

// Root endpoint for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Offbeat Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/user',
            stations: '/api/station',
            reviews: '/api/review',
            youtube: '/api/youtube'
        }
    });
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/station', stationRoutes)
app.use('/api/youtube', youtubeRoutes)

setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route... 
// it will still serve the index.html file
// and allow vue/react-router to take it from there
app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030

server.listen(port, '0.0.0.0', () => {
    logger.info('Server is running on port: ' + port)
    console.log(`🌐 Server is accessible at: http://localhost:${port}`)
    if (process.env.NODE_ENV === 'production') {
        console.log('🚀 Running in PRODUCTION mode')
    }
})