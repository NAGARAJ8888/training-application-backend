# Quick Start Guide - MongoDB Edition

Get up and running in 5 minutes! 🚀

## Option 1: Using Docker (Recommended)

### Prerequisites
- Node.js v18+
- Docker Desktop

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Start MongoDB with Docker**
```bash
docker-compose up -d
```

3. **Start the application**
```bash
npm run start:dev
```

That's it! The API is now running at `http://localhost:3000/api`

---

## Option 2: Using PowerShell Script (Windows)

```powershell
.\start.ps1
```

This script will:
- Install dependencies if needed
- Create .env file from template
- Start MongoDB container (if Docker is available)
- Start the application

---

## Option 3: Using Bash Script (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

---

## Option 4: Manual Setup

### Prerequisites
- Node.js v18+
- MongoDB installed and running

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.mongodb .env
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or with Docker
docker-compose up -d
```

4. **Start the application**
```bash
npm run start:dev
```

---

## Test the API

### 1. Register a new user

**curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
```

**PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### 2. Login

**curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.access_token
Write-Host "Token: $token"
```

### 3. Get your profile

**curl:**
```bash
curl -X GET http://localhost:3000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**PowerShell:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Get -Headers $headers
```

---

## Create an Admin User

After registering a user, promote them to admin:

### Using MongoDB Shell (mongosh)

```bash
mongosh

use comply_db

db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### Using Docker MongoDB

```bash
docker exec -it comply-mongodb mongosh

use comply_db

db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### Using MongoDB Compass (GUI)

1. Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Select `comply_db` database
4. Open `users` collection
5. Find the user and edit the `role` field to `admin`

---

## What's Next?

✅ Your API is running!
✅ You can register and login users
✅ JWT authentication is working

Now you can:
- 📖 Read the [full documentation](./README.md)
- 🧪 Try all [API endpoints](./API_TESTING.md)
- 🔧 Learn about [setup details](./SETUP.md)
- 🎨 Build a frontend
- 🚀 Deploy to production

---

## Troubleshooting

### Database connection error
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running
- With Docker: `docker-compose up -d`
- Without Docker: Start MongoDB service

**Verify MongoDB is running:**
```bash
# Check Docker container
docker ps

# Or test MongoDB connection
mongosh --eval "db.version()"
```

### Port already in use
```
Error: Port 3000 is already in use
```

**Solution:** Change port in `.env`
```env
PORT=3001
```

### Module not found
```
Error: Cannot find module '@nestjs/...'
```

**Solution:** Install dependencies
```bash
npm install
```

---

## Useful Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Format code
npm run format

# Lint code
npm run lint

# Stop Docker container
docker-compose down

# View Docker logs
docker-compose logs -f

# MongoDB shell
mongosh mongodb://localhost:27017

# MongoDB in Docker
docker exec -it comply-mongodb mongosh
```

---

## MongoDB Quick Reference

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017

# Show databases
show dbs

# Use database
use comply_db

# Show collections
show collections

# Find all users
db.users.find().pretty()

# Find one user
db.users.findOne({ email: "test@example.com" })

# Count users
db.users.countDocuments()

# Update user
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)

# Delete user
db.users.deleteOne({ email: "test@example.com" })
```

---

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (Your App)     │
└────────┬────────┘
         │ HTTP
         │ Authorization: Bearer <token>
         ▼
┌─────────────────┐
│   NestJS API    │
│   Port: 3000    │
│  /api/*         │
├─────────────────┤
│ ┌─────────────┐ │
│ │   Auth      │ │
│ │  Module     │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │   Users     │ │
│ │  Module     │ │
│ └─────────────┘ │
└────────┬────────┘
         │ Mongoose
         ▼
┌─────────────────┐
│    MongoDB      │
│   Port: 27017   │
│  comply_db      │
└─────────────────┘
```

---

## API Endpoints Summary

### Public Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get JWT token

### Protected Endpoints (requires JWT)
- `GET /api/auth/profile` - Get current user info

### Admin Only Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## MongoDB vs PostgreSQL

This project now uses MongoDB instead of PostgreSQL:

**Advantages:**
- ✅ No migrations needed
- ✅ Flexible schema
- ✅ JSON-like documents
- ✅ Easy to add custom fields
- ✅ Faster for document-based operations
- ✅ Better for nested data

**When to use PostgreSQL instead:**
- Need ACID transactions
- Complex relational data
- Strong schema enforcement
- Complex JOINs required

---

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comply_db?retryWrites=true&w=majority
```

---

## Happy Coding! 🎉

For more details, check out:
- [README.md](./README.md) - Full documentation
- [API_TESTING.md](./API_TESTING.md) - Complete API testing guide
- [SETUP.md](./SETUP.md) - Detailed setup instructions

---

Built with ❤️ using NestJS, Mongoose, and MongoDB
