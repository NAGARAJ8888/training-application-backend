# Project Structure - MongoDB Edition

Complete overview of the NestJS JWT Authentication backend project using MongoDB.

## 📁 Directory Structure

```
backend/
│
├── src/                                    # Source code
│   ├── auth/                              # Authentication module
│   │   ├── decorators/                    # Custom decorators
│   │   │   ├── current-user.decorator.ts  # Extract user from request
│   │   │   └── roles.decorator.ts         # Define required roles
│   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── login.dto.ts               # Login credentials
│   │   │   └── register.dto.ts            # Registration data
│   │   ├── guards/                        # Route guards
│   │   │   ├── jwt-auth.guard.ts          # JWT authentication guard
│   │   │   ├── local-auth.guard.ts        # Local auth guard
│   │   │   └── roles.guard.ts             # Role-based access guard
│   │   ├── strategies/                    # Passport strategies
│   │   │   ├── jwt.strategy.ts            # JWT validation strategy
│   │   │   └── local.strategy.ts          # Local auth strategy
│   │   ├── auth.controller.ts             # Auth endpoints
│   │   ├── auth.module.ts                 # Auth module config
│   │   └── auth.service.ts                # Auth business logic
│   │
│   ├── users/                             # Users module
│   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── create-user.dto.ts         # Create user data
│   │   │   └── update-user.dto.ts         # Update user data
│   │   ├── schemas/                       # Mongoose schemas
│   │   │   └── user.schema.ts             # User schema/model
│   │   ├── users.controller.ts            # User endpoints
│   │   ├── users.module.ts                # Users module config
│   │   └── users.service.ts               # Users business logic
│   │
│   ├── common/                            # Shared resources
│   │   └── enums/                         # Enumerations
│   │       └── role.enum.ts               # User roles (USER, ADMIN)
│   │
│   ├── app.module.ts                      # Root application module
│   └── main.ts                            # Application entry point
│
├── .env.mongodb                           # MongoDB environment template
├── .eslintrc.js                           # ESLint configuration
├── .gitignore                             # Git ignore rules
├── .prettierrc                            # Prettier configuration
├── API_TESTING.md                         # API testing guide
├── database-seed.js                       # MongoDB seed script
├── docker-compose.yml                     # Docker MongoDB setup
├── nest-cli.json                          # NestJS CLI config
├── package.json                           # Dependencies
├── PROJECT_STRUCTURE.md                   # This file
├── QUICKSTART.md                          # Quick start guide
├── README.md                              # Main documentation
├── SETUP.md                               # Detailed setup guide
├── start.ps1                              # PowerShell start script
├── start.sh                               # Bash start script
└── tsconfig.json                          # TypeScript configuration
```

## 📦 Modules Overview

### 🔐 Auth Module (`src/auth/`)

Handles authentication and authorization.

**Key Features:**
- JWT token generation and validation
- User registration and login
- Password hashing with bcrypt
- Role-based access control
- Custom decorators and guards

**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get authenticated user profile

**Files:**
- `auth.service.ts` - Authentication business logic
- `auth.controller.ts` - API endpoints
- `auth.module.ts` - Module configuration
- `jwt.strategy.ts` - JWT validation
- `local.strategy.ts` - Username/password validation

### 👥 Users Module (`src/users/`)

Manages user CRUD operations.

**Key Features:**
- User creation, reading, updating, deletion
- Email uniqueness validation
- Password hashing
- Role management
- Admin-only access

**Endpoints:**
- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `POST /api/users` - Create user (Admin)
- `PATCH /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

**Files:**
- `users.service.ts` - User business logic
- `users.controller.ts` - API endpoints
- `users.module.ts` - Module configuration
- `user.schema.ts` - Mongoose schema/model

### 🔧 Common Module (`src/common/`)

Shared resources across modules.

**Contents:**
- `role.enum.ts` - Role enumeration (USER, ADMIN)

## 🛡️ Guards and Decorators

### Guards

**JwtAuthGuard** (`jwt-auth.guard.ts`)
- Validates JWT tokens
- Ensures user is authenticated
- Use: `@UseGuards(JwtAuthGuard)`

**RolesGuard** (`roles.guard.ts`)
- Checks user roles
- Enforces role-based access
- Use: `@UseGuards(JwtAuthGuard, RolesGuard)`

**LocalAuthGuard** (`local-auth.guard.ts`)
- Validates username and password
- Used for login endpoint
- Use: `@UseGuards(LocalAuthGuard)`

### Decorators

**@Roles()** (`roles.decorator.ts`)
- Specify required roles for endpoint
- Usage: `@Roles(Role.ADMIN)`

**@CurrentUser()** (`current-user.decorator.ts`)
- Extract current user from request
- Usage: `@CurrentUser() user: User`

## 🗄️ Database - MongoDB

### User Schema

**users collection:**
```javascript
{
  _id: ObjectId,              // MongoDB ObjectId
  email: String (unique),     // User email
  password: String,           // Hashed password
  firstName: String,          // User's first name
  lastName: String,           // User's last name
  role: String (enum),        // 'user' or 'admin'
  isActive: Boolean,          // Account status
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Mongoose Schema (`user.schema.ts`)

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;
}
```

### Indexes

```javascript
// Unique index on email
db.users.createIndex({ email: 1 }, { unique: true })
```

## 🔑 Environment Variables

Required in `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/comply_db

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

### MongoDB Atlas (Cloud) Example

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comply_db?retryWrites=true&w=majority
```

## 🎯 Authentication Flow

### Registration Flow

```
1. User → POST /api/auth/register
2. Validate input (email, password, names)
3. Check if email exists (MongoDB unique constraint)
4. Hash password with bcrypt
5. Save user to MongoDB (default role: USER)
6. Generate JWT token
7. Return token + user data
```

### Login Flow

```
1. User → POST /api/auth/login
2. Validate credentials (LocalStrategy)
3. Find user by email in MongoDB
4. Compare password with bcrypt
5. Check if user is active
6. Generate JWT token
7. Return token + user data
```

### Protected Route Access Flow

```
1. User → Request with Authorization header
2. JwtAuthGuard extracts token
3. JwtStrategy validates token
4. Load user from MongoDB by ID
5. Attach user to request
6. RolesGuard checks user role (if required)
7. Allow/deny access
8. Execute controller method
```

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with salt rounds (10)
- Passwords never returned in responses
- Password excluded via class-transformer

✅ **JWT Security**
- Signed tokens with secret key
- Configurable expiration
- Token validation on each request

✅ **Input Validation**
- class-validator for DTOs
- Email format validation
- Password minimum length
- Whitelist and forbid non-whitelisted

✅ **Role-Based Access**
- Guards enforce role requirements
- Decorators define permissions
- Flexible role management

✅ **Database Security**
- Mongoose schema validation
- Unique constraints on email
- Protection against NoSQL injection (via Mongoose)

## 📝 DTOs (Data Transfer Objects)

### RegisterDto
```typescript
{
  email: string;      // Valid email format
  password: string;   // Min 6 characters
  firstName: string;  // Required
  lastName: string;   // Required
}
```

### LoginDto
```typescript
{
  email: string;      // Valid email format
  password: string;   // Required
}
```

### CreateUserDto
```typescript
{
  email: string;      // Valid email format
  password: string;   // Min 6 characters
  firstName: string;  // Required
  lastName: string;   // Required
  role?: Role;        // Optional (USER or ADMIN)
}
```

### UpdateUserDto
```typescript
{
  email?: string;       // Optional, valid email
  password?: string;    // Optional, min 6 chars
  firstName?: string;   // Optional
  lastName?: string;    // Optional
  role?: Role;          // Optional
  isActive?: boolean;   // Optional
}
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable MongoDB authentication
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting
- [ ] Add helmet for security headers
- [ ] Set up logging (Winston)
- [ ] Configure CORS for specific origins
- [ ] Add health check endpoint
- [ ] Set up monitoring
- [ ] Add refresh token mechanism
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Set up backup strategy
- [ ] Configure firewall rules
- [ ] Add API documentation (Swagger)
- [ ] Create database indexes
- [ ] Implement connection pooling

## 📚 Documentation Files

- **README.md** - Main project documentation
- **QUICKSTART.md** - Fast setup guide (5 minutes)
- **SETUP.md** - Detailed setup instructions
- **API_TESTING.md** - Complete API testing guide
- **PROJECT_STRUCTURE.md** - This file

## 🛠️ Development Tools

### Start Scripts
- `start.ps1` - PowerShell auto-setup script (Windows)
- `start.sh` - Bash auto-setup script (Linux/Mac)

### Docker
- `docker-compose.yml` - MongoDB container setup

### Database Seeding
- `database-seed.js` - Populate database with sample data

### Code Quality
- `.eslintrc.js` - Linting rules
- `.prettierrc` - Code formatting
- TypeScript for type safety

## 🧪 Testing Recommendations

### Unit Tests
- Test services in isolation
- Mock Mongoose models
- Test authentication logic
- Validate DTO transformations

### Integration Tests
- Test API endpoints
- Database operations
- Authentication flow
- Role-based access

### E2E Tests
- Complete user journeys
- Registration → Login → API calls
- Admin operations
- Error scenarios

## 📖 MongoDB vs SQL Comparison

### MongoDB Advantages (Used in this project)
- ✅ Flexible schema
- ✅ No migrations needed
- ✅ JSON-like documents
- ✅ Easy to add custom fields
- ✅ Fast for document operations
- ✅ Better for nested data

### When to Use PostgreSQL Instead
- Need ACID transactions across collections
- Complex relational data
- Require strong schema enforcement
- Complex JOIN operations

## 🔧 MongoDB Commands Reference

### Connection
```bash
# Local MongoDB
mongosh mongodb://localhost:27017

# MongoDB in Docker
docker exec -it comply-mongodb mongosh

# MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/myDatabase" --username username
```

### Common Operations
```javascript
// Use database
use comply_db

// Show collections
show collections

// Find all users
db.users.find().pretty()

// Find one user
db.users.findOne({ email: "test@example.com" })

// Count documents
db.users.countDocuments()

// Update user
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)

// Delete user
db.users.deleteOne({ email: "test@example.com" })

// Create index
db.users.createIndex({ email: 1 }, { unique: true })

// Show indexes
db.users.getIndexes()
```

## 💡 Extension Ideas

Enhance this project with:

- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] User profile with avatar upload
- [ ] Admin dashboard
- [ ] Audit logs (MongoDB change streams)
- [ ] API rate limiting (Redis)
- [ ] Swagger documentation
- [ ] WebSocket authentication
- [ ] Multi-tenancy support
- [ ] Permission system (beyond roles)
- [ ] Account lockout after failed attempts
- [ ] Session management
- [ ] User preferences in embedded documents
- [ ] Advanced search with MongoDB text search
- [ ] Aggregation pipelines for analytics

## 🎓 Learning Resources

To understand this project better:

1. **NestJS Fundamentals**
   - Modules, Controllers, Services
   - Dependency Injection
   - Middleware and Guards

2. **MongoDB & Mongoose**
   - Schema design
   - Queries and aggregations
   - Indexes and performance
   - Embedded vs referenced documents

3. **Authentication Concepts**
   - JWT (JSON Web Tokens)
   - Passport.js strategies
   - Password hashing (bcrypt)

4. **Role-Based Access Control**
   - Guards and decorators
   - Authorization patterns
   - Security best practices

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code structure
2. Use TypeScript types
3. Write clean, documented code
4. Follow NestJS best practices
5. Test your changes
6. Update documentation

---

Built with ❤️ using NestJS, Mongoose, and MongoDB
