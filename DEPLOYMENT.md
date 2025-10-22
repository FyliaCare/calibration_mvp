# Deployment Guide for Render

This guide will help you deploy the CalPro Calibration Management System to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Will be created automatically by Render

## 🚀 Deployment Steps

### Option 1: Using Blueprint (Recommended - One Click Deploy)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to [render.com/dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `calibration_mvp`
   - Render will automatically detect `render.yaml`
   - Click "Apply" to deploy

3. **Wait for Deployment**
   - Backend API: ~5-10 minutes
   - Frontend: ~3-5 minutes
   - Database: ~2-3 minutes

### Option 2: Manual Setup

#### Step 1: Create PostgreSQL Database

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `calibration-db`
   - **Database**: `calibration_production`
   - **User**: `calibration_user` (auto-generated)
   - **Region**: Oregon (or closest to you)
   - **Plan**: Starter ($7/month)
3. Click "Create Database"
4. **Copy** the Internal Database URL (starts with `postgresql://`)

#### Step 2: Deploy Backend API

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `calibration-backend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npx prisma migrate deploy && npm start
     ```
   - **Plan**: Starter ($7/month)

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[Paste Internal Database URL from Step 1]
   JWT_ACCESS_SECRET=[Generate random 64-char string]
   JWT_REFRESH_SECRET=[Generate random 64-char string]
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   LOG_LEVEL=info
   ```

   **Generate Secret Keys**:
   ```bash
   # On your local machine
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. Click "Create Web Service"

#### Step 3: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `calibration-frontend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://calibration-backend.onrender.com
   ```
   Replace with your actual backend URL from Step 2

5. **Configure Rewrites** (for React Router):
   - Add Rewrite Rule:
     - Source: `/*`
     - Destination: `/index.html`

6. Click "Create Static Site"

## ✅ Post-Deployment Checklist

### 1. Verify Backend Health
Visit: `https://calibration-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-22T...",
  "uptime": 123,
  "environment": "production"
}
```

### 2. Update Frontend API URL
If you used a different backend URL, update the frontend environment variable:
- Go to Frontend service → Environment
- Update `VITE_API_URL` to match your backend URL
- Trigger Manual Deploy

### 3. Run Database Migrations
Migrations run automatically on deployment, but if needed:
```bash
# Connect to your backend shell (in Render Dashboard)
npx prisma migrate deploy
```

### 4. Create Admin User (Optional)
```bash
# Connect to backend shell
npx prisma db seed
# Or create manually via Prisma Studio
```

### 5. Test the Application
1. Visit your frontend URL: `https://calibration-frontend.onrender.com`
2. Try logging in
3. Test creating a client
4. Test creating equipment
5. Test calibration workflows

## 🔧 Configuration

### Custom Domain (Optional)

#### Backend:
1. Go to Backend service → Settings → Custom Domain
2. Add your domain: `api.yourdomain.com`
3. Update DNS:
   ```
   CNAME api.yourdomain.com → calibration-backend.onrender.com
   ```

#### Frontend:
1. Go to Frontend service → Settings → Custom Domain
2. Add your domain: `app.yourdomain.com`
3. Update DNS:
   ```
   CNAME app.yourdomain.com → calibration-frontend.onrender.com
   ```

4. Update CORS in Backend:
   - Add environment variable: `CORS_ORIGIN=https://app.yourdomain.com`

### SSL/HTTPS
- Automatically provided by Render for free
- Certificates auto-renew

## 📊 Monitoring

### Backend Logs
- Go to Backend service → Logs
- View real-time logs
- Check for errors

### Frontend Logs
- Go to Frontend service → Logs
- View build and deploy logs

### Database
- Go to Database → Metrics
- Monitor connections, queries, storage

## 🔄 Updates & Redeploy

### Automatic Deploys
Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deploy
1. Go to service in Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

### Rollback
1. Go to service → Events
2. Find previous successful deploy
3. Click "Rollback to this version"

## 💰 Pricing

### Free Tier (Development)
- Backend: Free (spins down after 15 min inactivity)
- Frontend: Free
- Database: Not available on free tier

### Starter Tier (Production)
- Backend Web Service: $7/month
- Frontend Static Site: Free
- PostgreSQL Database: $7/month
- **Total: ~$14/month**

### Pro Tier (Scale)
- Backend: $25/month (more resources)
- Database: $25/month (more storage/connections)

## 🐛 Troubleshooting

### Backend Won't Start
1. Check logs for errors
2. Verify DATABASE_URL is correct
3. Check Prisma migrations:
   ```bash
   npx prisma migrate status
   ```

### Database Connection Failed
1. Verify DATABASE_URL format:
   ```
   postgresql://user:password@host:port/database
   ```
2. Check database is running (green status)
3. Try internal URL instead of external

### Frontend Can't Connect to Backend
1. Check VITE_API_URL is correct
2. Verify CORS_ORIGIN in backend matches frontend URL
3. Check backend /api/health endpoint

### Build Failures
1. Check Node version matches (20.x)
2. Verify package.json scripts
3. Check build logs for specific errors

## 🔐 Security Best Practices

1. **JWT Secrets**: Use strong, random keys (64+ characters)
2. **Database**: Use internal URL (not external) for backend connection
3. **CORS**: Only allow your frontend domain
4. **Rate Limiting**: Already configured
5. **HTTPS**: Enabled by default
6. **Environment Variables**: Never commit secrets to git

## 📞 Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)

## 🎉 You're Live!

Your CalPro Calibration Management System is now deployed and accessible globally!

- **Frontend**: https://calibration-frontend.onrender.com
- **Backend API**: https://calibration-backend.onrender.com
- **Database**: Managed PostgreSQL

Enjoy your deployment! 🚀
