#!/bin/bash

echo "=== MediaNudge Docker Troubleshooting ==="
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose >/dev/null 2>&1; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

echo "✅ docker-compose is available"

# Stop any existing containers
echo ""
echo "🔄 Stopping existing containers..."
docker-compose down -v

# Remove any orphaned containers
echo "🧹 Cleaning up..."
docker system prune -f

# Check port availability
echo ""
echo "🔍 Checking port availability..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Please stop the service using port 3000."
    lsof -i :3000
else
    echo "✅ Port 3000 is available"
fi

if lsof -i :5432 >/dev/null 2>&1; then
    echo "⚠️  Port 5432 is in use. You may need to stop PostgreSQL or change the port."
    lsof -i :5432
else
    echo "✅ Port 5432 is available"
fi

# Build and start containers
echo ""
echo "🏗️  Building containers..."
docker-compose build --no-cache

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check container status
echo ""
echo "📊 Container status:"
docker-compose ps

# Check logs
echo ""
echo "📝 Recent logs:"
docker-compose logs --tail=20

# Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
sleep 5
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✅ Application is responding on http://localhost:3000"
    echo ""
    echo "🎉 Setup complete! You can now access:"
    echo "   - Web App: http://localhost:3000"
    echo "   - Database: localhost:5432"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo "❌ Application is not responding. Check the logs above."
    echo ""
    echo "Try these commands:"
    echo "  docker-compose logs app"
    echo "  docker-compose logs postgres"
fi