#!/bin/bash

echo "🔧 Fixing Homepage Display Issue"
echo "================================="

# Step 1: Clean Next.js cache
echo "1. Cleaning Next.js build cache..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Step 2: Clean sitemap if exists
echo "2. Cleaning old sitemap..."
rm -f public/sitemap.xml

# Step 3: Regenerate sitemap
echo "3. Regenerating sitemap..."
npm run generate-sitemap

# Step 4: Rebuild without cache
echo "4. Rebuilding application..."
npm run build

echo ""
echo "✅ Done! Now test with:"
echo "   npm run start"
echo "   Then visit: http://localhost:3001"
