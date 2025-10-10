# FlyClim Build & Deployment Guide

## Build Scripts Overview

The project has two distinct build workflows optimized for different deployment environments:

### 1. **Local/VM Build** (with PM2)
```bash
npm run build
```

**Process:**
1. Generates sitemap from MongoDB data
2. Builds Next.js production bundle
3. Reloads PM2 process manager

**Use Cases:**
- Development server deployments
- VPS/VM with PM2 installed
- Traditional server environments

---

### 2. **Docker Build** (containerized)
```bash
npm run build:docker
```

**Process:**
1. Generates sitemap from MongoDB data
2. Builds Next.js production bundle
3. **Skips PM2 reload** (not needed in containers)

**Use Cases:**
- Docker container deployments
- Kubernetes/container orchestration
- Cloud container services (AWS ECS, Google Cloud Run, etc.)

---

## Docker Deployment

### Build Arguments
The Dockerfile accepts these build arguments for environment configuration:

```dockerfile
--build-arg MONGODB_URI=<your-mongodb-uri>
--build-arg NEXTAUTH_URL=<your-auth-url>
--build-arg NEXTAUTH_SECRET=<your-secret>
--build-arg NEXT_PUBLIC_METADATA_BASE=<your-base-url>
--build-arg OPENAI_API_KEY=<your-openai-key>
--build-arg GOOGLE_CLIENT_ID=<your-google-client-id>
--build-arg GOOGLE_CLIENT_SECRET=<your-google-secret>
--build-arg GOOGLE_PROJECT_ID=<your-project-id>
--build-arg LINKEDIN_CLIENT_ID=<your-linkedin-id>
--build-arg LINKEDIN_ACCESS_TOKEN=<your-linkedin-token>
--build-arg LINKEDIN_ORGANIZATION_ID=<your-org-id>
```

### Build Commands

#### Using docker-compose (recommended)
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

#### Using Docker directly
```bash
# Build image
docker build \
  --build-arg MONGODB_URI="mongodb+srv://..." \
  --build-arg NEXTAUTH_URL="https://www.flyclim.com" \
  --build-arg NEXTAUTH_SECRET="your-secret" \
  -t flyclim-website .

# Run container
docker run -d \
  -p 3001:3001 \
  --env-file .env.local \
  --name flyclim-website \
  flyclim-website

# View logs
docker logs -f flyclim-website

# Stop and remove
docker stop flyclim-website
docker rm flyclim-website
```

---

## Environment Variables

### Required for Build
These are needed during the Docker build process (sitemap generation):
- `MONGODB_URI` - MongoDB connection string

### Required for Runtime
These are needed when the container runs:
- `NEXTAUTH_URL` - Authentication callback URL
- `NEXTAUTH_SECRET` - JWT secret key
- `OPENAI_API_KEY` - OpenAI API key
- All Google OAuth credentials
- All LinkedIn API credentials

### Configuration Files

#### `.env.local` (for local development)
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
# ... other variables
```

#### `docker-compose.yml` (for container deployment)
Should reference environment variables from `.env.local` or use secrets management.

---

## Production Deployment Checklist

### Pre-Deployment
- [ ] Update `.env.local` with production values
- [ ] Test sitemap generation: `npm run generate-sitemap`
- [ ] Verify MongoDB connection
- [ ] Test build locally: `npm run build:docker`
- [ ] Review `REFACTORING_SUMMARY.md` for changes

### Docker Build
- [ ] Build image: `docker-compose build`
- [ ] Test container locally: `docker-compose up`
- [ ] Verify application loads on http://localhost:3001
- [ ] Check sitemap at http://localhost:3001/sitemap.xml
- [ ] Test all new routes (/eaip, /solutions, etc.)

### Deployment
- [ ] Push image to registry (if using)
- [ ] Deploy to production environment
- [ ] Verify DNS/load balancer configuration
- [ ] Test HTTPS certificate
- [ ] Submit sitemap to Google Search Console

### Post-Deployment
- [ ] Monitor container logs for errors
- [ ] Test all CTAs and links
- [ ] Verify JSON-LD renders correctly (view page source)
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor Core Web Vitals

---

## Troubleshooting

### Sitemap Not Generating
**Symptom:** `/sitemap.xml` returns 404 or is outdated

**Solution:**
```bash
# Manually regenerate sitemap
npm run generate-sitemap

# For Docker, rebuild the image
docker-compose build --no-cache
```

**Root Cause:** MongoDB connection might have failed during build

---

### PM2 Errors in Docker
**Symptom:** `pm2: command not found` during Docker build

**Solution:** Ensure you're using `build:docker` script, not `build`
```json
// In package.json - CORRECT
"build:docker": "npm run generate-sitemap && next build"

// WRONG - Don't use this in Docker
"build:docker": "npm run generate-sitemap && next build && pm2 reload ecosystem.config.js"
```

---

### MongoDB Connection Timeout During Build
**Symptom:** Sitemap generation hangs or fails

**Solution:**
1. Verify MongoDB URI is accessible from build environment
2. Check firewall rules allow outbound MongoDB Atlas connections
3. Test connection: `node scripts/generate-sitemap.js`

---

### Missing Environment Variables
**Symptom:** Build succeeds but runtime errors occur

**Solution:**
```bash
# List all required env vars
grep -r "process.env" app/ components/ lib/ | grep -v node_modules

# Ensure all are defined in .env.local or passed as build args
```

---

## Container Configuration

### Port Configuration
- **Internal Port:** 3001 (defined in Dockerfile)
- **External Port:** 3001 (mapped in docker-compose.yml)

**To change ports:**
```yaml
# docker-compose.yml
ports:
  - "8080:3001"  # Map external port 8080 to internal 3001
```

### Health Checks
Docker includes basic health checks:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## Next.js Standalone Mode

The application uses Next.js standalone output for optimized Docker images:

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  // ... other config
}
```

**Benefits:**
- ✅ Smaller image size (~150MB vs ~1GB)
- ✅ Faster cold starts
- ✅ Only includes necessary dependencies
- ✅ Production-optimized bundle

**Important Files:**
- `.next/standalone/` - Self-contained server
- `.next/static/` - Static assets
- `public/` - Public files (sitemap, robots.txt, images)

All three directories are copied into the Docker image.

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build \
            --build-arg MONGODB_URI=${{ secrets.MONGODB_URI }} \
            --build-arg NEXTAUTH_SECRET=${{ secrets.NEXTAUTH_SECRET }} \
            -t flyclim-website:${{ github.sha }} .

      - name: Push to registry
        run: |
          docker tag flyclim-website:${{ github.sha }} your-registry/flyclim-website:latest
          docker push your-registry/flyclim-website:latest
```

### GitLab CI Example
```yaml
build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build --build-arg MONGODB_URI=$MONGODB_URI -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

---

## Performance Optimization

### Build Time
- **Typical build:** 2-5 minutes
- **Sitemap generation:** 10-30 seconds
- **Next.js build:** 1-3 minutes
- **Docker layer caching:** Can reduce rebuild time to <1 minute

### Runtime Performance
- **Cold start:** ~2-3 seconds
- **Hot start:** <500ms
- **Memory usage:** ~200-400MB
- **CPU usage:** <10% idle, <50% under load

---

## Monitoring & Logging

### Container Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f app
```

### Application Logs
Next.js logs are written to stdout/stderr and captured by Docker.

### Health Monitoring
```bash
# Check container health
docker ps

# Detailed health info
docker inspect --format='{{json .State.Health}}' flyclim-website | jq
```

---

## Security Best Practices

### Secrets Management
❌ **Don't:**
- Commit `.env.local` to git
- Hardcode secrets in Dockerfile
- Use default secrets in production

✅ **Do:**
- Use Docker secrets or environment variables
- Rotate secrets regularly
- Use different secrets per environment

### Image Security
```bash
# Scan for vulnerabilities
docker scan flyclim-website

# Use specific base image versions
FROM node:18.17.0-alpine  # Instead of node:18-alpine
```

### Network Security
```yaml
# docker-compose.yml
services:
  app:
    networks:
      - internal
    ports:
      - "3001:3001"

networks:
  internal:
    driver: bridge
```

---

## Rollback Strategy

### Quick Rollback
```bash
# Tag previous working version
docker tag flyclim-website:latest flyclim-website:backup

# If new deployment fails, rollback
docker-compose down
docker tag flyclim-website:backup flyclim-website:latest
docker-compose up -d
```

### Version Tagging
```bash
# Tag with version number
docker tag flyclim-website:latest flyclim-website:v2.0.0

# Tag with git commit
docker tag flyclim-website:latest flyclim-website:$(git rev-parse --short HEAD)
```

---

## Summary

✅ **Docker build is properly configured** - `build:docker` script excludes PM2 reload
✅ **Sitemap generation included** - Runs during Docker build process
✅ **Standalone mode enabled** - Optimized for container deployment
✅ **Environment variables** - Properly separated between build and runtime
✅ **Port configuration** - Consistent internal/external port mapping (3001)

**Next Steps:**
1. Test Docker build locally: `docker-compose up --build`
2. Verify sitemap at http://localhost:3001/sitemap.xml
3. Deploy to production environment
4. Monitor logs for any issues
