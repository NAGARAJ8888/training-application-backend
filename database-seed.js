// MongoDB Seed Script for Comply Project
// Run this script with: node database-seed.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Configuration
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'comply_db';

// Sample users
const sampleUsers = [
  {
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
  },
  {
    email: 'test@example.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
  },
];

async function seedDatabase() {
  let client;

  try {
    console.log('🔌 Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    console.log('🗑️  Clearing existing users...');
    await usersCollection.deleteMany({});

    console.log('🔐 Hashing passwords and creating users...');
    
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const userData = {
        ...user,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(userData);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    // Create indexes
    console.log('📇 Creating indexes...');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on email');

    // Display created users
    console.log('\n📋 Created Users:');
    const users = await usersCollection.find({}, {
      projection: { password: 0 }
    }).toArray();

    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log('\n🔑 Login credentials:');
    sampleUsers.forEach(user => {
      console.log(`  Email: ${user.email} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the seed script
seedDatabase();

