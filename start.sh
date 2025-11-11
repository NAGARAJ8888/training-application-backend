#!/bin/bash

# Bash script to start the NestJS application with MongoDB (Linux/Mac)

echo "🚀 Starting Comply Project Backend (MongoDB)..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    if [ -f ".env.mongodb" ]; then
        echo "Creating .env from .env.mongodb..."
        cp .env.mongodb .env
        echo "✅ .env file created."
    else
        echo "Creating default .env file..."
        cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
EOF
        echo "✅ .env file created with default values."
    fi
    echo ""
fi

# Check if Docker is installed and mongodb container exists
if command -v docker &> /dev/null; then
    echo "🐳 Checking Docker MongoDB container..."
    
    if docker ps -a --format "{{.Names}}" | grep -q "comply-mongodb"; then
        if ! docker ps --format "{{.Names}}" | grep -q "comply-mongodb"; then
            echo "Starting MongoDB container..."
            docker start comply-mongodb
        else
            echo "✅ MongoDB container is already running"
        fi
    else
        echo "Creating MongoDB container..."
        docker-compose up -d
        echo "⏳ Waiting for MongoDB to be ready..."
        sleep 5
    fi
    echo ""
else
    echo "⚠️  Docker not found. Make sure MongoDB is running locally on port 27017"
    echo ""
fi

# Start the application
echo "🔥 Starting NestJS application in development mode..."
echo ""
echo "API will be available at: http://localhost:3000/api"
echo "MongoDB URI: mongodb://localhost:27017/comply_db"
echo "Press Ctrl+C to stop the server"
echo ""

npm run start:dev
