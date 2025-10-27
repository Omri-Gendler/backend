# 🚀 MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new project (e.g., "Sprint4-Backend")

## Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "sprint4-cluster")
5. Click "Create Cluster"

## Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username/password (remember these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <password> with your actual password
6. Replace <dbname> with your preferred database name

## Step 6: Environment Variables Setup
Create a `.env` file in your backend root with:

```
NODE_ENV=production
MONGO_URL=your_atlas_connection_string_here
DB_NAME=your_database_name
PORT=3030
```

## Step 7: Deploy to Production
- For local testing with Atlas: `npm run server:prod`
- For deployment platforms (Heroku, Railway, etc.): Set environment variables there

## Quick Test Commands:
```bash
# Test locally with Atlas
npm run server:prod

# Test development mode (local MongoDB)
npm run dev
```