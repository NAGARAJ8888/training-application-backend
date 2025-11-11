# NestJS Role-Based JWT Authentication with MongoDB

A complete NestJS backend implementation with JWT authentication and role-based access control (RBAC) using MongoDB.

## Features

- JWT Authentication
- Role-Based Access Control (User, Admin)
- User Registration and Login
- Password Hashing with bcrypt
- Protected Routes with Guards
- MongoDB with Mongoose
- Environment Configuration

## Roles

- **USER**: Basic user role with limited access
- **ADMIN**: Administrator role with full access

## Installation

```bash
npm install
```

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
docker-compose up -d
```

This will start a MongoDB container on port 27017.

### Option 2: Local MongoDB Installation

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Database will be created automatically on first connection

## Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

Or copy from the example:
```bash
cp .env.mongodb .env
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- **POST** `/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Protected Routes

- **GET** `/auth/profile` - Get user profile (requires authentication)
- **GET** `/users` - Get all users (Admin only)
- **GET** `/users/:id` - Get user by ID (Admin only)
- **PATCH** `/users/:id` - Update user (Admin only)
- **DELETE** `/users/:id` - Delete user (Admin only)

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

## Project Structure

```
src/
├── auth/
│   ├── decorators/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── schemas/
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── common/
│   └── enums/
├── app.module.ts
└── main.ts
```

## Usage

1. Register a new user using `/auth/register`
2. Login with credentials to receive JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Access protected routes

## Create Admin User

After registering a user, you can promote them to admin using MongoDB shell or a GUI tool:

### Using MongoDB Shell (mongosh)

```bash
mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Using Docker MongoDB

```bash
docker exec -it comply-mongodb mongosh

use comply_db

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Using MongoDB Compass

1. Connect to `mongodb://localhost:27017`
2. Select `comply_db` database
3. Open `users` collection
4. Find the user and edit the `role` field to `admin`

## Testing the API

See [API_TESTING.md](./API_TESTING.md) for comprehensive testing examples.

## MongoDB Features Used

- Mongoose ODM for schema definition
- Virtual fields for ID mapping
- Timestamps (createdAt, updatedAt)
- Unique indexes on email
- Schema validation

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords
- Enable HTTPS in production
- Implement rate limiting
- Add refresh token mechanism
- Use MongoDB authentication in production
- Enable MongoDB access control

## Advantages of MongoDB for this project

- Schema flexibility for user profiles
- Easy to add custom fields per user
- Fast queries with indexes
- Scalable for large user bases
- JSON-like documents match JavaScript objects
- No need for migrations (schema-less)

## Next Steps

- Add refresh tokens
- Implement email verification
- Add password reset functionality
- Enable MongoDB authentication
- Add API documentation (Swagger)
- Implement rate limiting
- Add logging (Winston)
- Set up monitoring

---

Built with ❤️ using NestJS, Mongoose, and MongoDB
