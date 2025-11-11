# API Testing Guide - MongoDB Edition

This guide provides curl commands and examples to test all the authentication endpoints.

## Base URL
```
http://localhost:3000/api
```

## Prerequisites

Make sure MongoDB is running:
```bash
# If using Docker
docker-compose up -d

# Verify
docker ps

# Or if using local MongoDB
mongosh --eval "db.version()"
```

## 1. Register a New User (USER role)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**PowerShell:**
```powershell
$body = @{
    email = "user@example.com"
    password = "password123"
    firstName = "John"
    lastName = "Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8e2d4b8c9a1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

## 2. Register an Admin User

MongoDB allows you to easily update user roles after registration:

### Step 1: Register normally
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Step 2: Promote to admin

**Using mongosh:**
```bash
mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Using Docker:**
```bash
docker exec -it comply-mongodb mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Using MongoDB Compass:**
1. Connect to `mongodb://localhost:27017`
2. Select `comply_db` database
3. Open `users` collection
4. Find the user and edit `role` to `admin`

## 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**PowerShell:**
```powershell
$body = @{
    email = "user@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token
Write-Host "Token: $token"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8e2d4b8c9a1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

## 4. Get User Profile (Requires Authentication)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**PowerShell:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Get -Headers $headers
```

**Response:**
```json
{
  "id": "673f8e2d4b8c9a1234567890",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "isActive": true,
  "createdAt": "2025-11-10T12:00:00.000Z",
  "updatedAt": "2025-11-10T12:00:00.000Z"
}
```

## 5. Get All Users (Admin Only)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**PowerShell:**
```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get -Headers $headers
```

**Response:**
```json
[
  {
    "id": "673f8e2d4b8c9a1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  },
  {
    "id": "673f8e2d4b8c9a1234567891",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-11-10T12:05:00.000Z",
    "updatedAt": "2025-11-10T12:05:00.000Z"
  }
]
```

## 6. Get User by ID (Admin Only)

```bash
curl -X GET http://localhost:3000/api/users/673f8e2d4b8c9a1234567890 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**PowerShell:**
```powershell
$userId = "673f8e2d4b8c9a1234567890"
$headers = @{
    Authorization = "Bearer $adminToken"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" -Method Get -Headers $headers
```

## 7. Update User (Admin Only)

```bash
curl -X PATCH http://localhost:3000/api/users/673f8e2d4b8c9a1234567890 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "role": "admin"
  }'
```

**PowerShell:**
```powershell
$userId = "673f8e2d4b8c9a1234567890"
$body = @{
    firstName = "Updated"
    role = "admin"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $adminToken"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" -Method Patch -Body $body -Headers $headers -ContentType "application/json"
```

## 8. Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/users/673f8e2d4b8c9a1234567890 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**PowerShell:**
```powershell
$userId = "673f8e2d4b8c9a1234567890"
$headers = @{
    Authorization = "Bearer $adminToken"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" -Method Delete -Headers $headers
```

## Testing Role-Based Access

### Test 1: User trying to access admin endpoint (Should fail)
```bash
# Login as user
USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' \
  | jq -r '.access_token')

# Try to access admin endpoint
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $USER_TOKEN"
```

**PowerShell:**
```powershell
# Login as user
$userBody = @{
    email = "user@example.com"
    password = "password123"
} | ConvertTo-Json

$userResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $userBody -ContentType "application/json"
$userToken = $userResponse.access_token

# Try to access admin endpoint (should fail)
$headers = @{
    Authorization = "Bearer $userToken"
}

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get -Headers $headers
} catch {
    Write-Host "Access denied (expected): $($_.Exception.Message)"
}
```

**Expected Response:** `403 Forbidden`

### Test 2: Admin accessing admin endpoint (Should succeed)
```bash
# Login as admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}' \
  | jq -r '.access_token')

# Access admin endpoint
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**PowerShell:**
```powershell
# Login as admin
$adminBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
$adminToken = $adminResponse.access_token

# Access admin endpoint (should succeed)
$headers = @{
    Authorization = "Bearer $adminToken"
}

$users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get -Headers $headers
$users | ConvertTo-Json
```

**Expected Response:** `200 OK` with users array

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 409 Conflict (Duplicate Email)
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

## MongoDB Direct Queries

### Check registered users
```bash
mongosh

use comply_db

// Find all users
db.users.find().pretty()

// Count users
db.users.countDocuments()

// Find user by email
db.users.findOne({ email: "user@example.com" })

// Find all admin users
db.users.find({ role: "admin" }).pretty()

// Find active users
db.users.find({ isActive: true }).pretty()
```

### Create Admin User Directly
```bash
mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

// Verify
db.users.findOne({ email: "admin@example.com" })
```

## Complete Testing Script (PowerShell)

Save this as `test-api.ps1`:

```powershell
# Complete API Testing Script

Write-Host "=== NestJS Auth API Testing ===" -ForegroundColor Cyan

# 1. Register User
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user.id)"
} catch {
    Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Login
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.access_token
Write-Host "✓ Login successful" -ForegroundColor Green
Write-Host "Token: $token"

# 3. Get Profile
Write-Host "`n3. Getting user profile..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

$profile = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Get -Headers $headers
Write-Host "✓ Profile retrieved" -ForegroundColor Green
Write-Host "Email: $($profile.email)"
Write-Host "Role: $($profile.role)"

# 4. Try to access admin endpoint (should fail)
Write-Host "`n4. Trying to access admin endpoint as user (should fail)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get -Headers $headers
    Write-Host "✗ Unexpected success - security issue!" -ForegroundColor Red
} catch {
    Write-Host "✓ Access denied as expected (403 Forbidden)" -ForegroundColor Green
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
```

Run with:
```powershell
.\test-api.ps1
```

## MongoDB Management

### Using MongoDB Compass

1. **Download**: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. **Connect**: `mongodb://localhost:27017`
3. **Navigate**: `comply_db` → `users` collection
4. **View/Edit**: See all users, edit roles, delete users

### Using Docker MongoDB

```bash
# Access MongoDB shell in Docker
docker exec -it comply-mongodb mongosh

# View logs
docker logs comply-mongodb

# Restart container
docker restart comply-mongodb

# Stop container
docker stop comply-mongodb

# Start container
docker start comply-mongodb
```

## Tips for Testing

1. **Use jq for JSON parsing** (Linux/Mac):
```bash
brew install jq  # Mac
sudo apt install jq  # Ubuntu

curl ... | jq '.access_token'
```

2. **Save tokens to variables**:
```bash
TOKEN=$(curl -s ... | jq -r '.access_token')
curl -H "Authorization: Bearer $TOKEN" ...
```

3. **Use Postman or Insomnia** for easier testing with collections

4. **Monitor MongoDB** with MongoDB Compass for real-time data viewing

5. **Check logs** if something fails:
```bash
# Application logs are in the terminal where you ran npm run start:dev

# Docker logs
docker logs comply-mongodb
```

---

Built with ❤️ using NestJS, Mongoose, and MongoDB
