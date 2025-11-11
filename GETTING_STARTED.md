# Getting Started - NestJS JWT Auth with MongoDB

Complete guide to get your authentication API running in minutes! 🚀

## 📋 Table of Contents

1. [Quick Start (2 minutes)](#quick-start)
2. [Installation Guide](#installation-guide)
3. [Testing the API](#testing-the-api)
4. [Creating an Admin User](#creating-an-admin-user)
5. [Project Overview](#project-overview)
6. [Next Steps](#next-steps)

---

## Quick Start

### Windows (PowerShell)
```powershell
.\start.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x start.sh
./start.sh
```

That's it! The script will:
- ✅ Install dependencies
- ✅ Create environment file
- ✅ Start MongoDB (if Docker is available)
- ✅ Start the application

**API URL:** `http://localhost:3000/api`

---

## Installation Guide

### Prerequisites

Choose **ONE** of these options:

**Option A: Docker** (Recommended)
- Node.js v18+
- Docker Desktop

**Option B: Local MongoDB**
- Node.js v18+
- MongoDB v6+

### Step-by-Step Installation

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Set Up Database

**With Docker:**
```bash
docker-compose up -d
```

**With Local MongoDB:**
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### 3. Configure Environment

```bash
# Copy environment template
cp .env.mongodb .env
```

Or create `.env` manually:
```env
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

#### 4. Start the Application

```bash
npm run start:dev
```

**Success!** API is now running at `http://localhost:3000/api`

---

## Testing the API

### 1. Register a User

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Using PowerShell:**
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
    firstName = "John"
    lastName = "Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method Post -Body $body -ContentType "application/json"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8e2d4b8c9a1234567890",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### 2. Login

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Using PowerShell:**
```powershell
$loginBody = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post -Body $loginBody -ContentType "application/json"

$token = $response.access_token
Write-Host "Your token: $token"
```

### 3. Get Profile (Protected Route)

**Using curl:**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Using PowerShell:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" `
  -Method Get -Headers $headers
```

### 4. Try Admin Endpoint (Should Fail)

```bash
# Should return 403 Forbidden
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

## Creating an Admin User

### Method 1: MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Select database
use comply_db

# Promote user to admin
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "john@example.com" })
```

### Method 2: Docker MongoDB

```bash
docker exec -it comply-mongodb mongosh

use comply_db

db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect: `mongodb://localhost:27017`
3. Navigate: `comply_db` → `users`
4. Find your user
5. Edit `role` field to `admin`
6. Save

### Method 4: Database Seed Script

```bash
node database-seed.js
```

This creates sample users:
- `user@example.com` / `password123` (user)
- `admin@example.com` / `admin123` (admin)
- `test@example.com` / `test123` (user)

---

## Project Overview

### What's Included?

✅ **Authentication**
- User registration
- User login
- JWT token generation
- Password hashing (bcrypt)

✅ **Authorization**
- Role-based access control
- USER and ADMIN roles
- Protected routes
- Role guards

✅ **Database**
- MongoDB with Mongoose
- User schema with validation
- Unique email constraint
- Timestamps (createdAt, updatedAt)

✅ **Security**
- Password hashing
- JWT validation
- Input validation
- CORS enabled

### Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication (login, register, JWT)
│   ├── users/         # User management (CRUD)
│   └── common/        # Shared resources (enums)
├── docker-compose.yml # MongoDB container
├── package.json       # Dependencies
└── .env              # Configuration
```

### API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get token |
| GET | `/api/auth/profile` | User | Get own profile |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PATCH | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## Next Steps

### 🎓 Learn More

- [README.md](./README.md) - Full documentation
- [API_TESTING.md](./API_TESTING.md) - Comprehensive testing guide
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture overview
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - PostgreSQL to MongoDB migration

### 🛠️ Customize

1. **Add more fields to User:**
   - Edit `src/users/schemas/user.schema.ts`
   - Add new fields to schema
   - No migrations needed!

2. **Add more roles:**
   - Edit `src/common/enums/role.enum.ts`
   - Add new role values
   - Use in guards and decorators

3. **Add more endpoints:**
   - Create new controllers
   - Use guards for protection
   - Apply role decorators

### 🚀 Deploy

1. **Choose hosting:**
   - Heroku
   - AWS (EC2, ECS, Lambda)
   - Google Cloud
   - DigitalOcean
   - Vercel (with serverless)

2. **Set up database:**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
   - Update `MONGODB_URI` in production

3. **Security checklist:**
   - [ ] Change `JWT_SECRET`
   - [ ] Enable MongoDB authentication
   - [ ] Use HTTPS
   - [ ] Add rate limiting
   - [ ] Set up monitoring
   - [ ] Configure CORS for specific origins

### 🎨 Build Frontend

This API works with any frontend:
- React / Next.js
- Vue / Nuxt
- Angular
- Svelte
- Mobile apps (React Native, Flutter)

**Example login flow:**
```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { access_token } = await response.json();
localStorage.setItem('token', access_token);

// Protected request
const profile = await fetch('http://localhost:3000/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

---

## Useful Commands

```bash
# Development
npm run start:dev        # Start with hot reload
npm run build           # Build for production
npm run start:prod      # Start production build

# Code Quality
npm run format          # Format with Prettier
npm run lint           # Lint with ESLint

# Docker
docker-compose up -d    # Start MongoDB
docker-compose down     # Stop MongoDB
docker-compose logs -f  # View logs
docker ps              # List containers

# MongoDB
mongosh                           # Connect to MongoDB
docker exec -it comply-mongodb mongosh  # MongoDB in Docker
```

---

## Troubleshooting

### Problem: Can't connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
docker ps

# Or start it
docker-compose up -d
```

### Problem: Port 3000 already in use

**Solution:** Change port in `.env`:
```env
PORT=3001
```

### Problem: Module not found

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Invalid token

**Solution:** Make sure `JWT_SECRET` matches in `.env`

---

## Support & Resources

📚 **Documentation:**
- [NestJS Docs](https://docs.nestjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [MongoDB Docs](https://www.mongodb.com/docs)
- [JWT.io](https://jwt.io)

🔧 **Tools:**
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com)
- [Insomnia](https://insomnia.rest)

📖 **This Project:**
- `README.md` - Overview
- `QUICKSTART.md` - 5-minute guide
- `SETUP.md` - Detailed setup
- `API_TESTING.md` - API examples
- `PROJECT_STRUCTURE.md` - Architecture

---

## Success Checklist

- [ ] MongoDB is running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Application starts (`npm run start:dev`)
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can access protected routes
- [ ] Created an admin user
- [ ] Admin can access admin routes
- [ ] Regular user cannot access admin routes

---

## What You've Built

🎉 **Congratulations!** You now have:

- ✅ Production-ready authentication API
- ✅ JWT-based security
- ✅ Role-based access control
- ✅ MongoDB database
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ TypeScript
- ✅ Modern architecture
- ✅ Easy to extend

**Ready to build something amazing!** 🚀

---

Built with ❤️ using NestJS, Mongoose, and MongoDB

---

## Quick Reference

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_TOKEN
```

### Promote to Admin
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

Happy coding! 🎉

