# Render.com Deployment Instructions

## Prerequisites
- Your code pushed to GitHub
- MongoDB Atlas connection string ready
- Render.com account created

## Environment Variables for Render
Set these in Render dashboard:

```
NODE_ENV=production
MONGO_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority
DB_NAME=sprint4_db
PORT=10000
SECRET=your-secret-key-here
```

## Build & Start Commands
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Important Notes
1. Render uses port 10000 by default
2. Make sure your MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Your app will be available at: https://your-app-name.onrender.com