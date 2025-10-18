# Railway Deployment Guide

## 🚂 Deploying CalPro to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected to Railway
- Railway CLI installed: `npm install -g @railway/cli`

---

## 🎯 Deployment Options

### Option 1: Railway CLI (Recommended for Quick Deploy)

#### Deploy Frontend
```bash
# Navigate to project root
cd "c:\Users\Jay Monty\Desktop\Projects\calibration_mvp"

# Login to Railway
railway login

# Link to Railway project (first time only)
railway link

# Build the project
npm run build

# Deploy
railway up
```

#### Deploy Backend
```bash
# Navigate to backend
cd backend

# Login (if not already)
railway login

# Link to backend service
railway link

# Deploy
railway up
```

---

### Option 2: GitHub Integration (Automated CI/CD)

#### Setup Steps

1. **Connect GitHub Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Create Frontend Service**
   - In Railway project, click "New Service"
   - Select "GitHub Repo"
   - Set root directory: `/`
   - Railway will auto-detect Vite project

3. **Configure Frontend Service**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx vite preview --host 0.0.0.0 --port $PORT`
   - **Port**: Will use Railway's `$PORT` variable (usually 443)

4. **Create Backend Service**
   - Click "New Service" again
   - Select same GitHub repo
   - Set root directory: `/backend`
   
5. **Configure Backend Service**
   - **Build Command**: `npm install`
   - **Start Command**: `node migrate-db.js && node server-auth.js`
   - **Port**: 3001 (or use `$PORT`)

6. **Set Environment Variables**

   **Frontend Variables**:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend.up.railway.app
   ```

   **Backend Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-secure-secret-key-here
   CORS_ORIGIN=https://your-frontend.up.railway.app
   DATABASE_URL=./calibration.db
   ```

7. **Generate Domain**
   - Click on each service
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URLs

8. **Update CORS and API URLs**
   - Update frontend `VITE_API_URL` with backend URL
   - Update backend `CORS_ORIGIN` with frontend URL
   - Redeploy both services

---

## 🔧 Configuration Files

### `railway.json` (Backend - Already exists)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install"
  },
  "deploy": {
    "startCommand": "cd backend && node migrate-db.js && npm start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### `railway.frontend.json` (Frontend - New)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx vite preview --host 0.0.0.0 --port ${PORT:-4173}",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 🔐 Required Secrets

Add these to Railway service variables:

### Frontend Service
- `NODE_ENV` = `production`
- `VITE_API_URL` = `https://your-backend-name.up.railway.app`

### Backend Service
- `NODE_ENV` = `production`
- `PORT` = `3001` (or use Railway's `$PORT`)
- `JWT_SECRET` = `your-very-secure-secret-key-min-32-chars`
- `CORS_ORIGIN` = `https://your-frontend-name.up.railway.app`
- `DATABASE_URL` = `./calibration.db`

---

## 🚀 Deployment Workflow

### Automatic Deployments (GitHub Integration)

When you push to GitHub:

1. **Push to `develop` or `restructure-codebase`**:
   - GitHub Actions runs tests
   - Builds project
   - Railway auto-deploys to staging environment

2. **Push to `main`**:
   - GitHub Actions runs tests
   - Builds project
   - Railway auto-deploys to production environment

### Manual Deployment

```bash
# Build locally
npm run build

# Deploy to Railway
railway up

# Or specify service
railway up --service frontend
railway up --service backend
```

---

## 🔍 Monitoring & Logs

### View Logs
```bash
# View frontend logs
railway logs --service frontend

# View backend logs
railway logs --service backend

# Follow logs in real-time
railway logs --follow
```

### Check Deployment Status
```bash
# Check service status
railway status

# List all services
railway service list
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs in Railway dashboard
# Or via CLI:
railway logs --service frontend

# Common issues:
# 1. Missing dependencies - check package.json
# 2. Build command incorrect - verify railway.json
# 3. Node version mismatch - Railway uses Node 18+
```

### Service Won't Start
```bash
# Check start command
# Verify PORT variable is used
# Check for errors in logs

# Test locally:
npm run build
npm run preview
```

### CORS Errors
```bash
# Update backend CORS_ORIGIN variable
# Should match frontend Railway URL exactly
# Include https:// prefix
# No trailing slash
```

### Database Issues
```bash
# Railway uses ephemeral filesystem
# Database resets on redeploy
# Solution: Use Railway's PostgreSQL plugin
# Or: Use persistent volume (Railway Pro)
```

---

## 📊 Performance Optimization

### Frontend Optimization
- ✅ Vite build optimization enabled
- ✅ Code splitting configured
- ✅ Minification enabled
- ✅ Source maps for debugging

### Backend Optimization
- ✅ SQLite for fast local queries
- ✅ JWT token caching
- ✅ CORS properly configured
- ✅ Health check endpoint

---

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. **On every push**:
   - Runs ESLint
   - Runs TypeScript type check
   - Runs unit tests
   - Generates coverage report

2. **On push to develop/restructure-codebase**:
   - Builds project
   - Deploys to Railway staging
   - Runs Lighthouse performance tests

3. **On push to main**:
   - Builds project
   - Deploys to Railway production
   - Creates GitHub release (if tagged)

### Required GitHub Secrets

Add these to your GitHub repository settings (Settings → Secrets → Actions):

- `RAILWAY_TOKEN` - Railway API token (get from Railway dashboard → Account → Tokens)

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend URL is accessible
- [ ] Backend URL is accessible
- [ ] API health check works: `https://backend-url/api/health`
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] No CORS errors in console
- [ ] All API calls work
- [ ] Environment variables are set correctly

---

## 🎯 URLs Structure

### Production
- **Frontend**: `https://calibration-mvp.up.railway.app`
- **Backend**: `https://calibration-mvp-backend.up.railway.app`
- **API Base**: `https://calibration-mvp-backend.up.railway.app/api`

### Staging
- **Frontend**: `https://calibration-mvp-staging.up.railway.app`
- **Backend**: `https://calibration-mvp-backend-staging.up.railway.app`

---

## 📞 Support

### Railway Resources
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Common Commands
```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Environment variables
railway variables

# Delete service
railway service delete
```

---

## 🎉 Deployment Complete!

Your CalPro application is now deployed on Railway with:
- ✅ Automatic deployments from GitHub
- ✅ Separate staging and production environments
- ✅ Environment variables configured
- ✅ Health checks enabled
- ✅ Performance monitoring
- ✅ Real-time logs

**Everything is ready for production use!** 🚀
