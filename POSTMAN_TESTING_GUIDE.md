# 🚀 Postman Testing Guide for Sprint4 Backend

## 🎯 Step-by-Step Testing Process

### Step 1: Create a User First
**Endpoint**: `POST http://localhost:3030/api/auth/signup`
**Body** (JSON):
```json
{
  "username": "puki",
  "password": "123",
  "fullname": "Puki Test User"
}
```

### Step 2: Login to Get Authentication
**Endpoint**: `POST http://localhost:3030/api/auth/login`
**Body** (JSON):
```json
{
  "username": "puki",
  "password": "123"
}
```

### Step 3: Test Station Endpoints

#### Get All Stations (No Auth Required)
**Endpoint**: `GET http://localhost:3030/api/station`
**Expected**: Empty array `[]` if no stations exist

#### Add a Music Station (Requires Auth)
**Endpoint**: `POST http://localhost:3030/api/station`
**Body** (JSON):
```json
{
  "title": "Chill Vibes",
  "description": "Perfect playlist for relaxing and unwinding",
  "spotifyId": "37i9dQZF1DXbrUpGvoi3TS",
  "imgUrl": "https://i.scdn.co/image/ab67706f00000002f2c72a29eafebf594195be53"
}
```
**Note**: You need to be logged in first!

#### Get Station by ID
**Endpoint**: `GET http://localhost:3030/api/station/{STATION_ID}`
Replace `{STATION_ID}` with actual ID from previous response

#### Update Station
**Endpoint**: `PUT http://localhost:3030/api/station/{STATION_ID}`
**Body** (JSON):
```json
{
  "_id": "STATION_ID_HERE",
  "title": "Updated Playlist Name",
  "description": "Updated playlist description",
  "spotifyId": "37i9dQZF1DXupdatedId",
  "imgUrl": "https://i.scdn.co/image/updated_image_url"
}
```

#### Delete Station
**Endpoint**: `DELETE http://localhost:3030/api/station/{STATION_ID}`

## 🍪 Authentication Notes

The authentication uses cookies, so make sure:
1. **Enable cookies** in Postman settings
2. **Login first** before testing protected endpoints
3. **Use the same Postman tab/session** for all requests

## 🐛 Common Issues & Solutions

### Issue: "Failed to signup" 
**Solution**: Username might already exist. Try different username.

### Issue: "Failed to login"
**Solution**: User doesn't exist. Create user with signup first.

### Issue: "Cannot add station" 
**Solution**: You're not authenticated. Login first.

### Issue: Empty response `[]`
**Solution**: This is normal - no data exists yet. Add some first!

## 📝 Sample Test Sequence

1. **Signup**: Create user "puki" with password "123"
2. **Login**: Login with same credentials  
3. **Get Stations**: Should return `[]`
4. **Add Station**: Create a new station
5. **Get Stations**: Should now show your station
6. **Get by ID**: Use the ID from step 4
7. **Update**: Modify the station
8. **Delete**: Remove the station

## 🚀 Quick Copy-Paste Bodies

**Signup Body**:
```json
{"username": "testuser", "password": "123", "fullname": "Test User"}
```

**Login Body**:
```json
{"username": "testuser", "password": "123"}
```

**Music Station Body**:
```json
{
  "title": "My Awesome Playlist",
  "description": "A collection of my favorite songs",
  "spotifyId": "37i9dQZF1DXbrUpGvoi3TS",
  "imgUrl": "https://i.scdn.co/image/ab67706f00000002f2c72a29eafebf594195be53"
}
```

**Car Body** (for car endpoints):
```json
{"vendor": "Tesla Model 3", "speed": 150}
```