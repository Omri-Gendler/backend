# 🚀 Render.com Deployment Troubleshooting

## 🔧 Common Issues & Solutions

### 1. CORS Errors ❌
**Problem**: Frontend can't connect to backend due to CORS policy

**Solution**: ✅ **FIXED** - Updated server.js with proper CORS configuration

### 2. Environment Variables Missing
**Check these on Render dashboard:**

#### Backend Environment Variables:
```
NODE_ENV=production
MONGO_URL=your_atlas_connection_string
DB_NAME=sprint4_db
SECRET=your-secret-key-here
YOUTUBE_API_KEY=your_youtube_api_key (optional)
```

#### Frontend Environment Variables:
```
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

### 3. API Base URL in Frontend
**In your React app**, make sure you're using the correct API URL:

```javascript
// services/http.service.js or config file
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030'
```

### 4. Test Your Deployment

#### Test Backend Health:
```
https://your-backend-name.onrender.com/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-31T...",
  "environment": "production",
  "port": 10000
}
```

#### Test Backend API:
```
https://your-backend-name.onrender.com/api/station
```
**Expected Response:**
```json
[]
```

#### Test Frontend:
```
https://offbeat-front.onrender.com
```

### 5. Debug Steps

#### Check Backend Logs on Render:
1. Go to your backend service on Render
2. Click "Logs" tab
3. Look for errors during startup

#### Check Frontend Logs on Render:
1. Go to your frontend service on Render  
2. Click "Logs" tab
3. Look for build errors

#### Network Tab Debugging:
1. Open browser DevTools → Network tab
2. Try to use your app
3. Look for failed requests (red status)

### 6. Common Fix Commands

#### Redeploy Backend:
```bash
git add .
git commit -m "fix: CORS and deployment issues"
git push origin main
```

#### Force Render Redeploy:
- Go to Render dashboard
- Click "Manual Deploy"
- Select "Deploy latest commit"

### 7. Render-Specific Settings

#### Backend Service Settings:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

#### Frontend Service Settings:
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Redirects/Rewrites**: `/* /index.html 200` (for React Router)

## 🎯 Quick Diagnosis

### If you see CORS errors:
1. ✅ Check backend CORS origins include your frontend URL
2. ✅ Check frontend is using correct backend URL
3. ✅ Make sure both services are deployed

### If you see 404 errors:
1. Check API endpoints exist in backend
2. Check frontend is calling correct URLs
3. Check build completed successfully

### If authentication fails:
1. Check cookie settings in auth controller
2. Check CORS credentials: true
3. Check both apps are on HTTPS (Render auto-provides this)

## 🔍 Current Status Check

Your fixes are now deployed. Test these URLs:

1. **Backend Health**: `https://your-backend-name.onrender.com/api/health`
2. **Backend API**: `https://your-backend-name.onrender.com/api/station`  
3. **Frontend**: `https://offbeat-front.onrender.com`

If still having issues, check the Render logs and let me know what you see! 🚀