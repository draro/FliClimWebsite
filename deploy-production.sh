#!/bin/bash

# Production Deployment Script for FlyClim Website
# Run this on the production server (srv1050461)

set -e  # Exit on error

echo "🚀 FlyClim Production Deployment"
echo "================================="
echo ""

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code from GitHub..."
git pull origin main
echo "✅ Code updated"
echo ""

# Step 2: Stop existing container
echo "🛑 Step 2: Stopping existing container..."
docker compose down || docker-compose down || true
echo "✅ Container stopped"
echo ""

# Step 3: Remove old images (optional, for clean rebuild)
echo "🧹 Step 3: Cleaning old images..."
docker images | grep flyclim | awk '{print $3}' | xargs docker rmi -f || true
echo "✅ Old images removed"
echo ""

# Step 4: Build new image
echo "🔨 Step 4: Building new Docker image..."
docker compose build --no-cache || docker-compose build --no-cache
echo "✅ New image built"
echo ""

# Step 5: Start container
echo "▶️  Step 5: Starting new container..."
docker compose up -d || docker-compose up -d
echo "✅ Container started"
echo ""

# Step 6: Check logs
echo "📋 Step 6: Checking container logs..."
sleep 5
docker compose logs --tail=50 || docker-compose logs --tail=50
echo ""

# Step 7: Verify deployment
echo "🔍 Step 7: Verifying deployment..."
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment successful! Site is responding."
else
    echo "⚠️  Warning: Site returned HTTP $HTTP_CODE"
    echo "Check logs: docker compose logs -f"
fi
echo ""

# Step 8: Reload Nginx (to clear any cache)
echo "🔄 Step 8: Reloading Nginx..."
nginx -t && systemctl reload nginx
echo "✅ Nginx reloaded"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Visit: https://www.flyclim.com"
echo "📊 Monitor: docker compose logs -f"
echo "🔍 Status: docker compose ps"
echo ""
