# 🚀 Deployment Guide - Render + Supabase (Free Tier)

Complete guide for deploying CalPro to Render with Supabase PostgreSQL database.

## ✅ Prerequisites

- ✅ GitHub account
- ✅ Render account ([render.com](https://render.com))
- ✅ Supabase account ([supabase.com](https://supabase.com))

---

## 📦 Step 1: Set Up Supabase Database

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Click **"New project"**
4. Configure:
   - **Organization**: Select or create
   - **Name**: `calibration-mvp`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing**: **Free** tier
5. Click **"Create new project"**
6. Wait ~2 minutes for setup

### Get Connection String

1. Once ready, click **"Connect"** button
2. Or go to **Project Settings** → **Database**
3. Under "Connection string", select:
   - **Method**: `Transaction pooler` ⭐ (Important!)
   - **Type**: `URI`
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Connection string format:**
```
postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 🎯 Step 2: Deploy to Render

### Option A: Blueprint Deployment (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render with Supabase"
   git push origin main
   ```

2. **Create Blueprint on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**
   - Connect GitHub repository
   - Select `calibration_mvp`
   - Render detects `render.yaml`
   - Click **"Apply"**

3. **Add DATABASE_URL**
   - During blueprint setup or after
   - Go to `calibration-backend` service → **Environment**
   - Add or edit `DATABASE_URL`
   - Paste your Supabase connection string
   - Click **"Save Changes"**

4. **Wait for deployment** (~10 minutes)

### Option B: Manual Deployment

#### 2.1 Deploy Backend

1. **Click "New +" → "Web Service"**
2. **Connect repository**: `calibration_mvp`
3. **Configure:**
   - **Name**: `calibration-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `master` or `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     NODE_ENV=development npm install && npm run prisma:generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Plan**: Free

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   JWT_ACCESS_SECRET=[generate 64-char random string]
   JWT_REFRESH_SECRET=[generate 64-char random string]
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://calibration-frontend.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   LOG_LEVEL=info
   ```

5. **Health Check Path**: `/api/health`

6. Click **"Create Web Service"**

#### 2.2 Deploy Frontend

1. **Click "New +" → "Static Site"**
2. **Connect repository**: `calibration_mvp`
3. **Configure:**
   - **Name**: `calibration-frontend`
   - **Branch**: `master` or `main`
   - **Root Directory**: `frontend`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://calibration-backend.onrender.com
   ```

5. **Rewrites and Redirects:**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

6. Click **"Create Static Site"**

---

## 🗄️ Step 3: Run Database Migrations

After backend deploys:

1. Go to `calibration-backend` service
2. Click **"Shell"** tab
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

Or migrations should run automatically on startup if configured in `package.json`.

---

## ✅ Step 4: Verify Deployment

### Check Backend

1. Visit: `https://calibration-backend.onrender.com/api/health`
2. Should return:
   ```json
   {
     "ok": true,
     "status": "ok",
     "timestamp": "2025-10-22T...",
     "version": "2.0.0",
     "database": "connected",
     "auth": "enabled",
     "environment": "production"
   }
   ```

### Check Frontend

1. Visit: `https://calibration-frontend.onrender.com`
2. Should see login page
3. Try navigating to different routes

### Check Database

1. Go to Supabase → Your project → **Table Editor**
2. You should see all tables created:
   - users
   - clients
   - equipment
   - calibration_records
   - calibration_schedules
   - refresh_tokens
   - audit_logs

---

## 👤 Step 5: Create Admin User

You need an admin user to log in. Two options:

### Option A: Using Prisma Studio (Local)

1. In your local terminal:
   ```bash
   cd backend
   DATABASE_URL="your-supabase-connection-string" npx prisma studio
   ```
2. Open browser at `http://localhost:5555`
3. Click **users** table → **Add record**
4. Fill in:
   - email: `admin@example.com`
   - passwordHash: (generate with bcrypt)
   - name: `Admin User`
   - role: `ADMIN`
   - isActive: `true`

### Option B: Using Render Shell

1. Go to `calibration-backend` → **Shell**
2. Run seed script (if you have one):
   ```bash
   npm run prisma:seed
   ```

### Option C: Generate Password Hash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(h => console.log(h))"
```

Then insert directly in Supabase Table Editor.

---

## 🌐 Step 6: Custom Domain (Optional)

### Backend Domain

1. In Render → `calibration-backend` → **Settings**
2. Scroll to **Custom Domain**
3. Add: `api.yourdomain.com`
4. Update DNS:
   ```
   CNAME api.yourdomain.com → calibration-backend.onrender.com
   ```

### Frontend Domain

1. In Render → `calibration-frontend` → **Settings**
2. Add: `app.yourdomain.com`
3. Update DNS:
   ```
   CNAME app.yourdomain.com → calibration-frontend.onrender.com
   ```

### Update Environment Variables

After adding custom domains:
- Update `CORS_ORIGIN` in backend to `https://app.yourdomain.com`
- Update `VITE_API_URL` in frontend to `https://api.yourdomain.com`

---

## 📊 Monitoring & Logs

### View Logs

- **Backend**: Render Dashboard → `calibration-backend` → **Logs**
- **Frontend**: Render Dashboard → `calibration-frontend` → **Logs**
- **Database**: Supabase → Your project → **Database** → **Logs**

### Metrics

- **Render**: Each service has metrics tab
- **Supabase**: Project dashboard shows connection stats

---

## 🔄 Updates & Redeployment

### Automatic Deploys

Render auto-deploys on git push to main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deploy

In Render Dashboard:
- Go to service → Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback

- Go to service → **"Events"** tab
- Find previous successful deploy
- Click **"Rollback to this version"**

---

## 💰 Costs

### Free Tier (What you're using)

- **Render Backend**: Free
  - Spins down after 15 min inactivity
  - 750 hours/month
- **Render Frontend**: Free
  - 100 GB bandwidth/month
- **Supabase Database**: Free
  - 500 MB storage
  - Unlimited API requests
  - Daily backups (7 days retention)

**Total: $0/month** 🎉

### Paid Tier (If needed later)

- **Render Backend**: $7/month (Starter)
  - No spin down
  - 512 MB RAM
- **Supabase Pro**: $25/month
  - 8 GB storage
  - Daily backups (30 days)
  - Better performance

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error**: "Can't reach database server"
- ✅ Check DATABASE_URL is correct
- ✅ Verify using Transaction pooler (port 6543)
- ✅ Password is correct in connection string

**Error**: "Prisma migration failed"
- Run migrations manually in Shell
- Check database permissions

### Frontend Can't Reach Backend

- Check `VITE_API_URL` environment variable
- Verify CORS_ORIGIN in backend matches frontend URL
- Check backend health endpoint responds

### Database Connection Issues

- Verify Supabase project is active
- Check connection limit (free tier: 60 connections)
- Use Transaction pooler, not Direct connection

---

## 🔐 Security Best Practices

✅ **JWT Secrets**: Use cryptographically random 64+ character strings  
✅ **Database Password**: Strong, unique password  
✅ **Environment Variables**: Never commit `.env` files  
✅ **CORS**: Only allow your frontend domain  
✅ **HTTPS**: Always use HTTPS in production (automatic with Render)  
✅ **Rate Limiting**: Keep limits reasonable  
✅ **Database**: Use Supabase's Row Level Security (RLS) for extra protection  

---

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Connection string copied (Transaction pooler)
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Render
- [ ] DATABASE_URL added to backend environment
- [ ] Migrations ran successfully
- [ ] Admin user created
- [ ] Health endpoint responds
- [ ] Frontend loads correctly
- [ ] Can log in successfully

---

**🎉 Your CalPro system is now live and running!**

Backend: `https://calibration-backend.onrender.com`  
Frontend: `https://calibration-frontend.onrender.com`  
Database: Supabase (managed)
