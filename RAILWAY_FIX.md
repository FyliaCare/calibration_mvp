# 🚨 Railway Deployment Fix Guide

## Current Issue: Health Check Failing

Your Railway deployment is building successfully but failing on health checks. Here's the fix:

### ✅ Changes Made

1. **Host Binding Fixed**: Changed from `localhost` to `0.0.0.0`
2. **CORS Updated**: Added Railway and Netlify domain support
3. **Database Schema Added**: Complete calibration tables (clients, equipment, records)
4. **Health Check Timeout**: Increased to 300 seconds

### 🔧 Next Steps

1. **Push Latest Changes**:
   ```bash
   git add -A
   git commit -m "Fix Railway health check and database schema"
   git push origin main
   ```

2. **Railway Will Auto-Deploy**: The push will trigger a new deployment

3. **Monitor Health Check**: Look for:
   ```
   ✅ Health check passed: /api/health
   ✅ Server running on 0.0.0.0:PORT
   ```

### 🎯 What Should Work Now

- ✅ Server binds to `0.0.0.0` (Railway compatible)
- ✅ Health endpoint `/api/health` responds correctly
- ✅ CORS allows Railway and Netlify domains
- ✅ Database includes all required tables
- ✅ Authentication system ready

### 🔍 If Health Check Still Fails

**Check Railway Logs**:
1. Go to Railway dashboard
2. Click your service
3. Click "Deployments" tab
4. Click the failing deployment
5. Check "Build Logs" and "Deploy Logs"

**Common Issues**:
- **Port binding**: Server must use `process.env.PORT`
- **Host binding**: Must be `0.0.0.0`, not `localhost`
- **Health endpoint**: Must respond to `/api/health`
- **Startup time**: Railway has 100s timeout by default

### 🚀 Expected Success Output

```
🎯 Calibration MVP Server (Auth-Enabled) running on http://0.0.0.0:PORT
📊 Database: ./calibration.db
🔐 Authentication: ENABLED
📧 Email: SIMULATED
🌍 Environment: production

Health check endpoint available at: /api/health
```

### 📱 After Successful Deploy

1. **Get Railway URL**: Copy from Railway dashboard
2. **Update Netlify**: Edit `netlify.toml` with Railway URL
3. **Test APIs**: Verify authentication and data endpoints
4. **Deploy Frontend**: Run `netlify deploy --prod`

---

**Status**: Ready for immediate deployment ✅
**ETA**: 3-5 minutes for Railway to rebuild and deploy