# Production Server Deployment Instructions

## Quick Deployment (Automated)

Run this on your production server **srv1050461**:

```bash
# SSH into your server
ssh root@srv1050461

# Navigate to project directory
cd /FliClimWebsite

# Run the automated deployment script
./deploy-production.sh
```

That's it! The script will:
1. Pull latest code from GitHub
2. Stop the old container
3. Remove old Docker images
4. Build new image with latest changes
5. Start the new container
6. Reload Nginx to clear cache
7. Verify the deployment

---

## Manual Deployment (Step by Step)

If you prefer manual control or the script has issues:

### Step 1: Pull Latest Code
```bash
cd /FliClimWebsite
git pull origin main
```

### Step 2: Stop Existing Container
```bash
docker compose down
# or
docker-compose down
```

### Step 3: Remove Old Images (Optional but Recommended)
```bash
# List images
docker images | grep flyclim

# Remove old images
docker rmi $(docker images | grep flyclim | awk '{print $3}')
```

### Step 4: Build New Image
```bash
# Build without cache to ensure fresh build
docker compose build --no-cache
# or
docker-compose build --no-cache
```

This will take 3-5 minutes and will:
- Install dependencies
- Generate sitemap from MongoDB
- Build Next.js production bundle
- Create optimized Docker image

### Step 5: Start New Container
```bash
docker compose up -d
# or
docker-compose up -d
```

### Step 6: Check Logs
```bash
docker compose logs -f
# or
docker-compose logs -f

# Press Ctrl+C to exit log view
```

Look for:
```
✓ Ready in XXXms
- Local: http://localhost:3001
```

### Step 7: Verify Site
```bash
# Test local response
curl http://localhost:3001

# Should return HTML starting with <!DOCTYPE html>
```

### Step 8: Reload Nginx
```bash
# Test Nginx configuration
nginx -t

# Reload Nginx (clears cache)
systemctl reload nginx
```

### Step 9: Test Live Site
Visit https://www.flyclim.com in your browser

You should see:
- **Hero**: "Enterprise eAIP System for Civil Aviation Authorities"
- **Subheading**: "ICAO Annex 15 Compliant Digital AIP Platform"
- **Trust Badges**: ✓ ICAO Compliant, ✓ EUROCONTROL Spec 3.0, etc.
- **Blue Button**: "Explore eAIP System →"

---

## Troubleshooting

### Issue: Old Content Still Showing

**Solution 1: Clear Browser Cache**
```bash
# Hard refresh in browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or open in incognito/private window
```

**Solution 2: Clear Nginx Cache**
```bash
# If you have proxy cache configured
rm -rf /var/cache/nginx/*
systemctl reload nginx
```

**Solution 3: Force Rebuild Container**
```bash
docker compose down
docker rmi $(docker images | grep flyclim | awk '{print $3}')
docker compose build --no-cache
docker compose up -d
```

### Issue: Container Won't Start

**Check Logs:**
```bash
docker compose logs --tail=100
```

**Common Issues:**

1. **Port 3001 in use:**
   ```bash
   lsof -i :3001
   # Kill the process or use different port
   ```

2. **Environment variables missing:**
   ```bash
   # Check .env.local exists
   ls -la /FliClimWebsite/.env.local

   # Verify MONGODB_URI is set
   grep MONGODB_URI /FliClimWebsite/.env.local
   ```

3. **Docker disk space:**
   ```bash
   df -h
   docker system df
   docker system prune -a
   ```

### Issue: Site Returns 502 Bad Gateway

**Cause:** Container is not running or not responding

**Solution:**
```bash
# Check container status
docker compose ps

# Should show:
# NAME              STATUS
# flyclim-website   Up X minutes

# If not running:
docker compose up -d

# Check application logs
docker compose logs -f
```

### Issue: Site Returns 404

**Cause:** Nginx not proxying correctly

**Solution:**
```bash
# Test Nginx config
nginx -t

# Check proxy settings
cat /etc/nginx/sites-enabled/flyclim-website

# Reload Nginx
systemctl reload nginx
```

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads: https://www.flyclim.com
- [ ] Shows eAIP-focused content (not old pilot app)
- [ ] eAIP page loads: https://www.flyclim.com/eaip
- [ ] Sitemap accessible: https://www.flyclim.com/sitemap.xml
- [ ] No 404 for /app route (we removed it)
- [ ] SSL certificate valid
- [ ] All navigation links work
- [ ] No console errors (F12 in browser)
- [ ] Mobile responsive
- [ ] Fast page load (<3 seconds)

---

## Rollback Procedure

If something goes wrong:

### Option 1: Rollback Git
```bash
cd /FliClimWebsite

# View recent commits
git log --oneline -5

# Rollback to previous commit
git reset --hard <commit-hash>

# Rebuild
docker compose build --no-cache
docker compose up -d
```

### Option 2: Use Previous Docker Image
```bash
# List all images with history
docker images

# Run previous version
docker run -d -p 3001:3001 --env-file .env.local <image-id>
```

---

## Monitoring

### Check Container Health
```bash
# Container status
docker compose ps

# Resource usage
docker stats flyclim-website

# Detailed info
docker inspect flyclim-website
```

### Check Application Logs
```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Logs with timestamps
docker compose logs -f --timestamps
```

### Check Nginx Logs
```bash
# Access log
tail -f /var/log/nginx/access.log

# Error log
tail -f /var/log/nginx/error.log

# Search for errors
grep -i error /var/log/nginx/error.log
```

---

## Performance Optimization

After deployment, if site is slow:

### 1. Enable Nginx Caching
Add to `/etc/nginx/sites-enabled/flyclim-website`:

```nginx
# Add inside server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
    proxy_pass http://localhost:3001;
    proxy_cache_valid 200 30d;
    add_header Cache-Control "public, immutable";
}
```

### 2. Enable Gzip Compression
Add to nginx config:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
```

### 3. Add Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

Then reload:
```bash
nginx -t && systemctl reload nginx
```

---

## Automated Monitoring (Optional)

### Setup Health Check Cron
```bash
# Add to crontab
crontab -e

# Add this line:
*/5 * * * * curl -f http://localhost:3001 || echo "FlyClim is DOWN" | mail -s "Alert" admin@flyclim.com
```

### Setup Log Rotation
```bash
# Create /etc/logrotate.d/flyclim
cat > /etc/logrotate.d/flyclim << 'EOF'
/var/log/nginx/flyclim-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
EOF
```

---

## Support

If you encounter issues:

1. **Check logs** first (Docker + Nginx)
2. **Review troubleshooting section** above
3. **Verify DNS** pointing to correct server
4. **Check firewall** rules (ports 80, 443, 3001)
5. **Verify SSL certificate** not expired

**Emergency Rollback:**
```bash
cd /FliClimWebsite
git reset --hard HEAD~1
docker compose build --no-cache
docker compose up -d
systemctl reload nginx
```

---

## Contact

- **Email**: info@flyclim.com
- **Phone**: +1 (989) 447-2494
- **GitHub**: https://github.com/draro/FliClimWebsite

---

**Last Updated**: 2025-10-10
**Server**: srv1050461
**Port**: 3001
**Domain**: www.flyclim.com
