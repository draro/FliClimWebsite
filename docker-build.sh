#!/bin/bash

# Docker Build Script for FlyClim Website
# This script ensures all environment variables are properly loaded before building

set -e  # Exit on error

echo "🚀 FlyClim Docker Build Script"
echo "================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with all required environment variables."
    echo "See .env.example for reference."
    exit 1
fi

# Load environment variables from .env.local
echo "📦 Loading environment variables from .env.local..."
export $(grep -v '^#' .env.local | xargs)

# Verify critical environment variables
echo "✅ Checking required environment variables..."

if [ -z "$MONGODB_URI" ]; then
    echo "❌ Error: MONGODB_URI is not set in .env.local"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Error: NEXTAUTH_SECRET is not set in .env.local"
    exit 1
fi

echo "✅ All required environment variables are set"

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
echo "This may take 3-5 minutes..."
echo ""

docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Start the container: docker-compose up -d"
    echo "  2. View logs: docker-compose logs -f"
    echo "  3. Stop the container: docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
