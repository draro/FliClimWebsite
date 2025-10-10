# Docker Build & Deployment Troubleshooting Guide

## Quick Start

### Build the Docker Image
```bash
# Method 1: Using the helper script (recommended)
./docker-build.sh

# Method 2: Using docker-compose directly
docker-compose build

# Method 3: Clean build (removes cache)
docker-compose build --no-cache
```

### Start the Container
```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# View logs after starting
docker-compose logs -f
```

---

## Common Errors & Solutions

### Error: "Invalid/Missing environment variable: MONGODB_URI"

**Symptom:**
```
Error: Invalid/Missing environment variable: "MONGODB_URI"
```

**Cause:** Environment variables not properly passed during Docker build

**Solutions:**

1. **Ensure .env.local exists and has correct values:**
   ```bash
   # Check if file exists
   ls -la .env.local

   # Verify MONGODB_URI is set
   grep MONGODB_URI .env.local
   ```

2. **Use the build script** (recommended):
   ```bash
   chmod +x docker-build.sh
   ./docker-build.sh
   ```

3. **Manual build with explicit env vars:**
   ```bash
   # Export environment variables first
   export $(grep -v '^#' .env.local | xargs)

   # Then build
   docker-compose build
   ```

4. **Check docker-compose.yml has all build args:**
   ```yaml
   build:
     args:
       MONGODB_URI: ${MONGODB_URI}
       # ... other variables
   ```

---

### Error: "PM2 command not found" in Docker

**Symptom:**
```
pm2: command not found
```

**Cause:** Using `npm run build` instead of `npm run build:docker`

**Solution:**
Ensure Dockerfile uses the correct build script:
```dockerfile
RUN npm run build:docker  # ✅ Correct - No PM2
# NOT: npm run build      # ❌ Wrong - Tries to use PM2
```

---

### Error: Port 3001 already in use

**Symptom:**
```
Error: bind: address already in use
```

**Solution:**

1. **Check what's using port 3001:**
   ```bash
   lsof -i :3001
   ```

2. **Stop the conflicting process:**
   ```bash
   # If it's another Docker container
   docker-compose down

   # If it's a Node process
   kill -9 <PID>
   ```

3. **Change the external port in docker-compose.yml:**
   ```yaml
   ports:
     - "3002:3001"  # Map external 3002 to internal 3001
   ```

---

### Error: Sitemap not found (404)

**Symptom:**
Accessing `/sitemap.xml` returns 404

**Cause:** Sitemap generation failed or wasn't included in build

**Solution:**

1. **Check if sitemap.xml was generated:**
   ```bash
   # Test sitemap generation locally
   npm run generate-sitemap

   # Check if file was created
   ls -la public/sitemap.xml
   ```

2. **Ensure build:docker includes sitemap generation:**
   ```json
   // package.json
   "build:docker": "npm run generate-sitemap && next build"
   ```

3. **Verify MongoDB connection during build:**
   ```bash
   # Test MongoDB connection
   node -e "const { MongoClient } = require('mongodb'); MongoClient.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
   ```

4. **Rebuild with no cache:**
   ```bash
   docker-compose build --no-cache
   ```

---

### Error: Next.js build fails

**Symptom:**
```
Build error occurred
Error: Failed to collect page data
```

**Causes & Solutions:**

1. **Missing environment variables:**
   - Check all required vars are in `.env.local`
   - Verify they're passed as build args in `docker-compose.yml`

2. **TypeScript errors:**
   ```bash
   # Check for TypeScript errors
   npm run lint
   ```

3. **React errors (unescaped entities):**
   ```bash
   # Look for apostrophes, quotes in JSX
   # Replace ' with &apos;
   # Replace " with &quot;
   ```

4. **Out of memory:**
   ```bash
   # Increase Node memory
   export NODE_OPTIONS="--max-old-space-size=4096"
   docker-compose build
   ```

---

### Container starts but shows errors

**Symptom:**
Container is running but application doesn't work

**Diagnosis:**

1. **Check container logs:**
   ```bash
   docker-compose logs -f
   docker logs flyclim-website
   ```

2. **Access container shell:**
   ```bash
   docker exec -it flyclim-website sh

   # Inside container, check:
   ls -la /app/.next
   cat /app/.next/BUILD_ID
   env | grep MONGODB_URI
   ```

3. **Test the application:**
   ```bash
   curl http://localhost:3001
   curl http://localhost:3001/api/health  # If you have a health endpoint
   ```

---

### Container health check failing

**Symptom:**
```
Health check failed
```

**Solution:**

1. **Check health check command:**
   ```yaml
   # docker-compose.yml
   healthcheck:
     test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001"]
   ```

2. **Verify wget is available in container:**
   ```bash
   docker exec flyclim-website which wget

   # If wget is not available, install it or use curl
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3001"]
   ```

3. **Increase start_period if app takes long to start:**
   ```yaml
   healthcheck:
     start_period: 60s  # Give app more time to start
   ```

---

## Build Performance Issues

### Slow build times

**Solutions:**

1. **Enable BuildKit:**
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose build
   ```

2. **Use layer caching:**
   ```dockerfile
   # In Dockerfile, ensure dependencies are copied separately
   COPY package*.json ./
   RUN npm ci
   COPY . .  # This won't invalidate cache unless code changes
   ```

3. **Reduce build context:**
   Create `.dockerignore`:
   ```
   node_modules
   .git
   .next
   .env*
   *.log
   README.md
   ```

---

## Runtime Issues

### MongoDB connection timeout

**Symptom:**
```
MongoServerError: connection timeout
```

**Solutions:**

1. **Check MongoDB Atlas IP whitelist:**
   - Add `0.0.0.0/0` to allow all IPs (development only)
   - Or add your server's IP address

2. **Verify connection string:**
   ```bash
   # Test connection
   docker exec flyclim-website node -e "const {MongoClient}=require('mongodb');MongoClient.connect(process.env.MONGODB_URI).then(()=>console.log('OK')).catch(console.error)"
   ```

3. **Check network connectivity:**
   ```bash
   docker exec flyclim-website ping google.com
   ```

---

### Authentication issues

**Symptom:**
NextAuth callback errors or session issues

**Solutions:**

1. **Verify NEXTAUTH_URL matches deployment URL:**
   ```bash
   # For local: http://localhost:3001
   # For production: https://www.flyclim.com
   ```

2. **Check NEXTAUTH_SECRET is set and consistent:**
   ```bash
   echo $NEXTAUTH_SECRET
   ```

3. **Ensure runtime environment variables are passed:**
   ```yaml
   # docker-compose.yml
   env_file:
     - .env.local  # This loads all vars at runtime
   ```

---

## Debugging Tips

### Enable verbose logging

1. **Next.js debug mode:**
   ```bash
   # Add to .env.local
   NODE_ENV=development
   DEBUG=*
   ```

2. **Docker build verbose:**
   ```bash
   docker-compose build --progress=plain
   ```

3. **Container logs with timestamps:**
   ```bash
   docker-compose logs -f --timestamps
   ```

### Inspect build layers

```bash
# List Docker images
docker images

# Inspect image layers
docker history flyclim-website:latest

# Check image size
docker images flyclim-website --format "{{.Size}}"
```

### Test locally before Docker

```bash
# Ensure app works locally first
npm run dev

# Test production build locally
npm run build
npm run start
```

---

## Environment Variable Checklist

Before building, ensure these are set in `.env.local`:

### Required (Build Time):
- [ ] `MONGODB_URI` - MongoDB connection string

### Required (Runtime):
- [ ] `PORT` - Server port (3001)
- [ ] `NEXTAUTH_URL` - Auth callback URL
- [ ] `NEXTAUTH_SECRET` - JWT secret
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth
- [ ] `LINKEDIN_CLIENT_ID` - LinkedIn API
- [ ] `LINKEDIN_ACCESS_TOKEN` - LinkedIn API

### Verify:
```bash
# Check all required vars are set
grep -E "^(MONGODB_URI|NEXTAUTH_SECRET|PORT)=" .env.local
```

---

## Clean Slate Rebuild

If all else fails, start fresh:

```bash
# 1. Stop and remove containers
docker-compose down -v

# 2. Remove images
docker rmi flyclim-website

# 3. Clear Docker build cache
docker builder prune -a -f

# 4. Verify .env.local
cat .env.local

# 5. Rebuild from scratch
./docker-build.sh

# 6. Start fresh
docker-compose up -d

# 7. Monitor logs
docker-compose logs -f
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Update `.env.local` with production values
- [ ] Change `NEXTAUTH_URL` to production URL (https://www.flyclim.com)
- [ ] Use strong `NEXTAUTH_SECRET` (not 'drc2023')
- [ ] Test build locally: `./docker-build.sh`
- [ ] Test container locally: `docker-compose up`
- [ ] Verify sitemap: `curl http://localhost:3001/sitemap.xml`
- [ ] Test all pages load correctly
- [ ] Check browser console for errors
- [ ] Verify JSON-LD renders (view page source)
- [ ] Test authentication flow
- [ ] Check MongoDB connection works
- [ ] Review security warnings from Docker scan
- [ ] Set up monitoring/logging
- [ ] Configure SSL/TLS certificates
- [ ] Set up backups
- [ ] Document rollback procedure

---

## Getting Help

If issues persist:

1. **Check logs in detail:**
   ```bash
   docker-compose logs --tail=100
   ```

2. **Inspect the built image:**
   ```bash
   docker run -it --entrypoint sh flyclim-website
   ```

3. **Review GitHub Issues:**
   - Next.js: https://github.com/vercel/next.js/issues
   - Docker: https://github.com/docker/compose/issues

4. **Contact Support:**
   - Email: info@flyclim.com
   - Phone: +1 (989) 447-2494
