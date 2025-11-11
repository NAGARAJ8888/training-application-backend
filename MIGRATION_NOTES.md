# Migration Notes: PostgreSQL to MongoDB

This document outlines the changes made to migrate from PostgreSQL/TypeORM to MongoDB/Mongoose.

## Summary of Changes

The project has been successfully migrated from PostgreSQL to MongoDB while maintaining all authentication and authorization functionality.

## Key Changes

### 1. Dependencies Updated

**Removed:**
- `@nestjs/typeorm`
- `typeorm`
- `pg` (PostgreSQL driver)

**Added:**
- `@nestjs/mongoose`
- `mongoose`

### 2. User Entity → User Schema

**Before (TypeORM Entity):**
```typescript
// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;
  // ...
}
```

**After (Mongoose Schema):**
```typescript
// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  // ...
}
```

### 3. Service Layer Changes

**Before (TypeORM Repository):**
```typescript
constructor(
  @InjectRepository(User)
  private usersRepository: Repository<User>,
) {}

async findAll(): Promise<User[]> {
  return this.usersRepository.find();
}
```

**After (Mongoose Model):**
```typescript
constructor(
  @InjectModel(User.name)
  private userModel: Model<UserDocument>,
) {}

async findAll(): Promise<User[]> {
  return this.userModel.find().exec();
}
```

### 4. Module Configuration

**Before (TypeORM):**
```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    // ...
  }),
})
```

**After (Mongoose):**
```typescript
MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
})
```

### 5. Environment Variables

**Before:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=comply_db
```

**After:**
```env
MONGODB_URI=mongodb://localhost:27017/comply_db
```

### 6. Docker Configuration

**Before (PostgreSQL):**
```yaml
services:
  postgres:
    image: postgres:14-alpine
    ports:
      - '5432:5432'
```

**After (MongoDB):**
```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - '27017:27017'
```

### 7. Database Seeding

**Before:** SQL script (`database-seed.sql`)
**After:** JavaScript script (`database-seed.js`)

Run with:
```bash
node database-seed.js
```

## Feature Parity

All features remain functional after migration:

✅ User Registration
✅ User Login
✅ JWT Authentication
✅ Role-Based Access Control (USER, ADMIN)
✅ Protected Routes
✅ Password Hashing
✅ Input Validation
✅ Error Handling

## ID Field Handling

MongoDB uses `_id` with ObjectId, but we've added a virtual `id` field for consistency:

```typescript
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
```

This ensures API responses use `id` instead of `_id`.

## Advantages of MongoDB

1. **No Migrations**: Schema changes don't require migration files
2. **Flexible Schema**: Easy to add new fields per user
3. **JSON Documents**: Natural fit for JavaScript/TypeScript
4. **Fast Operations**: Excellent for document-based queries
5. **Embedded Documents**: Can store nested data structures
6. **Horizontal Scaling**: Sharding support for large datasets

## Potential Considerations

### When PostgreSQL Might Be Better

- Need complex multi-table JOINs
- Require strict ACID guarantees across multiple entities
- Complex relational data models
- Need advanced SQL features (window functions, CTEs)

### MongoDB is Great For This Project Because

- Simple user documents
- No complex relationships
- Flexible user profiles
- Document-oriented data
- Fast single-collection queries

## Testing the Migration

1. **Start MongoDB:**
```bash
docker-compose up -d
```

2. **Run the application:**
```bash
npm install
npm run start:dev
```

3. **Test endpoints:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

4. **Verify in MongoDB:**
```bash
mongosh

use comply_db
db.users.find().pretty()
```

## Performance Considerations

### Indexes

MongoDB automatically creates an index on `_id`. We also create:
- Unique index on `email`

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

### Query Optimization

- Use `.lean()` for read-only queries (faster)
- Use `.select()` to limit returned fields
- Use `.limit()` and `.skip()` for pagination
- Use aggregation pipeline for complex queries

## Database Management Tools

### MongoDB Compass
- GUI tool for MongoDB
- Download: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connection: `mongodb://localhost:27017`

### MongoDB Shell (mongosh)
```bash
# Local
mongosh mongodb://localhost:27017

# Docker
docker exec -it comply-mongodb mongosh
```

## Production Considerations

1. **Use MongoDB Atlas** (managed cloud service)
2. **Enable authentication:**
```javascript
db.createUser({
  user: "admin",
  pwd: "strongpassword",
  roles: ["readWrite"]
})
```

3. **Connection pooling** is handled by Mongoose automatically

4. **Backup strategy:**
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/comply_db" --out=/backup

# Restore
mongorestore --uri="mongodb://localhost:27017/comply_db" /backup/comply_db
```

5. **Monitor performance** with MongoDB Atlas or tools like:
   - MongoDB Cloud Manager
   - Ops Manager
   - Third-party tools (Datadog, New Relic)

## Common MongoDB Operations

```javascript
// Find users
db.users.find({ role: "admin" })

// Update user role
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)

// Count users
db.users.countDocuments()

// Delete user
db.users.deleteOne({ email: "user@example.com" })

// Find with projection
db.users.find({}, { password: 0 })

// Find with sort
db.users.find().sort({ createdAt: -1 })

// Find with limit
db.users.find().limit(10)
```

## Troubleshooting

### Connection Issues
```
MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running (`docker-compose up -d`)

### Duplicate Key Error
```
MongoServerError: E11000 duplicate key error
```
**Solution:** Email already exists (working as intended for uniqueness)

### Invalid ObjectId
```
CastError: Cast to ObjectId failed
```
**Solution:** Ensure you're passing valid MongoDB ObjectId strings

## Files Changed

### Modified Files
- `package.json` - Dependencies updated
- `src/app.module.ts` - Changed to MongooseModule
- `src/users/users.service.ts` - Uses Mongoose Model
- `src/users/users.module.ts` - Uses MongooseModule
- `src/auth/auth.service.ts` - Minor adjustments for Mongoose
- `docker-compose.yml` - MongoDB container
- All documentation files

### New Files
- `src/users/schemas/user.schema.ts` - Mongoose schema
- `.env.mongodb` - MongoDB environment template
- `database-seed.js` - MongoDB seed script
- `MIGRATION_NOTES.md` - This file

### Deleted Files
- `src/users/entities/user.entity.ts` - TypeORM entity (replaced by schema)
- `database-seed.sql` - SQL seed script (replaced by JS)

## Next Steps

1. ✅ Migration complete
2. ✅ All features working
3. ✅ Documentation updated
4. 📝 Consider adding MongoDB-specific features:
   - Text search indexes
   - Aggregation pipelines
   - Embedded documents for user preferences
   - Change streams for real-time updates
   - Geospatial queries (if needed)

## Rollback Plan

If you need to revert to PostgreSQL:

1. Checkout the previous commit
2. Run `npm install` to restore old dependencies
3. Update `.env` with PostgreSQL credentials
4. Start PostgreSQL: `docker-compose up -d`

---

**Migration Status:** ✅ Complete

**Tested:** ✅ All endpoints working

**Performance:** ✅ Similar or better than PostgreSQL for this use case

Built with ❤️ using NestJS, Mongoose, and MongoDB

