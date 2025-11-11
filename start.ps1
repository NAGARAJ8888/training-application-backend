# PowerShell script to start the NestJS application with MongoDB

Write-Host "🚀 Starting Comply Project Backend (MongoDB)..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Red
    if (Test-Path ".env.mongodb") {
        Write-Host "Creating .env from .env.mongodb..." -ForegroundColor Yellow
        Copy-Item .env.mongodb .env
        Write-Host "✅ .env file created." -ForegroundColor Green
    } else {
        Write-Host "Creating default .env file..." -ForegroundColor Yellow
        @"
MONGODB_URI=mongodb://localhost:27017/comply_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
        Write-Host "✅ .env file created with default values." -ForegroundColor Green
    }
    Write-Host ""
}

# Check if Docker is installed and mongodb container exists
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    Write-Host "🐳 Checking Docker MongoDB container..." -ForegroundColor Cyan
    $containerExists = docker ps -a --format "{{.Names}}" | Select-String -Pattern "comply-mongodb"
    
    if ($containerExists) {
        $containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern "comply-mongodb"
        if (-Not $containerRunning) {
            Write-Host "Starting MongoDB container..." -ForegroundColor Yellow
            docker start comply-mongodb
        } else {
            Write-Host "✅ MongoDB container is already running" -ForegroundColor Green
        }
    } else {
        Write-Host "Creating MongoDB container..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
    Write-Host ""
} else {
    Write-Host "⚠️  Docker not found. Make sure MongoDB is running locally on port 27017" -ForegroundColor Yellow
    Write-Host ""
}

# Start the application
Write-Host "🔥 Starting NestJS application in development mode..." -ForegroundColor Green
Write-Host ""
Write-Host "API will be available at: http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "MongoDB URI: mongodb://localhost:27017/comply_db" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run start:dev
