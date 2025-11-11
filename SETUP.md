# Setup Instructions

Follow these steps to set up and run the NestJS JWT Authentication backend with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher) OR Docker
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Database Setup

### Option A: Using Docker (Recommended)

1. Start MongoDB container:
```bash
docker-compose up -d
```

2. Verify MongoDB is running:
```bash
docker ps
```

You should see `comply-mongodb` container running.

### Option B: Local MongoDB Installation

1. Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:

**Windows:**
```powershell
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

3. Verify MongoDB is running:
```bash
mongosh --eval "db.version()"
```

### Option C: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

## Step 3: Environment Configuration

1. Create `.env` file:
```bash
cp .env.mongodb .env
```

Or create manually:
```env
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong, random string in production!

## Step 4: Run the Application

### Development Mode (with hot reload)
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000/api`

## Step 5: Test the API

### Quick Test
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### For comprehensive testing, see [API_TESTING.md](./API_TESTING.md)

## Step 6: Create an Admin User

After registering a regular user, you can promote them to admin:

### Method 1: Using mongosh
```bash
mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Using Docker MongoDB
```bash
docker exec -it comply-mongodb mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Using MongoDB Compass (GUI)
1. Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Select `comply_db` database
4. Open `users` collection
5. Find your user and edit `role` to `admin`

## Troubleshooting

### Database Connection Issues

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Verify MongoDB is running:
   ```bash
   # Docker
   docker ps
   
   # Local MongoDB
   mongosh --eval "db.version()"
   ```

2. Check connection string in `.env`

3. Start MongoDB:
   ```bash
   # Docker
   docker-compose up -d
   
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:** Change the port in `.env`:
```env
PORT=3001
```

### JWT Token Issues

**Error:** `JsonWebTokenError: invalid signature`

**Solution:** Ensure `JWT_SECRET` in `.env` matches the one used to generate tokens

### Module Not Found

**Error:** `Cannot find module '@nestjs/...'`

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Timeout

**Error:** `MongooseServerSelectionError: connection timed out`

**Solutions:**
1. Check MongoDB is accessible:
   ```bash
   mongosh mongodb://localhost:27017
   ```

2. Check firewall settings
3. For MongoDB Atlas, whitelist your IP address

## Project Structure

```
backend/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── decorators/       # Custom decorators (Roles, CurrentUser)
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── guards/           # Auth guards (JWT, Local, Roles)
│   │   ├── strategies/       # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                # Users module
│   │   ├── schemas/          # Mongoose schemas
│   │   ├── dto/              # User DTOs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── common/               # Shared resources
│   │   └── enums/           # Enums (Role)
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── docker-compose.yml        # Docker setup
└── nest-cli.json             # NestJS CLI config
```

## Development Tools

### Format Code
```bash
npm run format
```

### Lint Code
```bash
npm run lint
```

### Build
```bash
npm run build
```

## MongoDB Management Tools

### MongoDB Compass (GUI)
- Download: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connection: `mongodb://localhost:27017`

### MongoDB Shell (mongosh)
```bash
# Connect
mongosh mongodb://localhost:27017

# List databases
show dbs

# Use database
use comply_db

# List collections
show collections

# Find all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Update user role
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)

# Delete user
db.users.deleteOne({ email: "user@example.com" })
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Configure environment
4. ✅ Run the application
5. ✅ Test the API
6. ✅ Create an admin user

For API testing examples, see [API_TESTING.md](./API_TESTING.md)

## MongoDB Advantages

- **Flexible Schema**: Easy to add new user fields
- **JSON Documents**: Natural fit for JavaScript/TypeScript
- **No Migrations**: Schema changes don't require migrations
- **Fast Queries**: Excellent performance with proper indexing
- **Scalability**: Easy horizontal scaling
- **Embedded Documents**: Can store nested data structures

## Additional Features to Consider

- [ ] Refresh Token Implementation
- [ ] Email Verification
- [ ] Password Reset
- [ ] Rate Limiting
- [ ] API Documentation (Swagger)
- [ ] Unit Tests
- [ ] E2E Tests
- [ ] MongoDB Atlas Integration
- [ ] CI/CD Pipeline
- [ ] Logging (Winston)
- [ ] Health Checks
- [ ] Database Backup Strategy
- [ ] MongoDB Indexes Optimization
- [ ] MongoDB Transactions (if needed)

## Security Best Practices

1. ✅ Passwords are hashed with bcrypt
2. ✅ JWT tokens for authentication
3. ✅ Role-based access control
4. ✅ Input validation with class-validator
5. ⚠️ Change JWT_SECRET in production
6. ⚠️ Enable HTTPS in production
7. ⚠️ Implement rate limiting
8. ⚠️ Enable MongoDB authentication
9. ⚠️ Use environment-specific configs
10. ⚠️ Implement refresh tokens

## MongoDB Security

For production, enable MongoDB authentication:

```bash
# Create admin user
mongosh

use admin

db.createUser({
  user: "admin",
  pwd: "strongpassword",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Update connection string
MONGODB_URI=mongodb://admin:strongpassword@localhost:27017/comply_db?authSource=admin
```

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the [API_TESTING.md](./API_TESTING.md) guide
3. Ensure all dependencies are installed
4. Verify database connection
5. Check application logs

---

Built with ❤️ using NestJS, Mongoose, and MongoDB
