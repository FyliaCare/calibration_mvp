# CalPro Production Deployment Guide

## 🚀 Phase 1: Backend Deployment

### Option A: Railway (Recommended)
1. **Create Railway Account**: https://railway.app
2. **Deploy Backend**:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```
3. **Environment Variables**:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secure-secret-here`
   - `DB_PATH=./production.db`
   - `ALLOWED_ORIGINS=https://your-netlify-url.netlify.app`

### Option B: Heroku
1. **Create Heroku Account**: https://heroku.com
2. **Deploy**:
   ```bash
   cd backend
   heroku create calpro-backend
   git push heroku main
   ```

### Option C: Render
1. **Create Render Account**: https://render.com
2. **Connect GitHub repo**
3. **Set build command**: `cd backend && npm install`
4. **Set start command**: `cd backend && npm start`

## 🌐 Phase 2: Frontend Deployment

### Update Netlify Configuration
1. **Update netlify.toml** with real backend URL
2. **Remove demo mode** from production build
3. **Deploy to Netlify**

## 🔧 Phase 3: Production Optimizations

### Security
- [ ] Environment variables for sensitive data
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input validation

### Performance
- [ ] Database optimization
- [ ] CDN for static assets
- [ ] Compression
- [ ] Caching headers

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics
- [ ] Uptime monitoring
- [ ] Performance monitoring

## 📊 Phase 4: Database & Storage

### Production Database Options
1. **Railway PostgreSQL** (recommended)
2. **PlanetScale MySQL**
3. **MongoDB Atlas**
4. **AWS RDS**

### File Storage
1. **Cloudinary** (images/documents)
2. **AWS S3**
3. **Railway volumes**

## 🔐 Phase 5: Advanced Features

### Authentication
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] SSO integration

### Features
- [ ] Real-time notifications
- [ ] PDF generation
- [ ] Email integration
- [ ] Backup systems
- [ ] Multi-tenancy

## 🎯 Quick Start (30 minutes)

### 1. Deploy Backend to Railway
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2. Get Backend URL
```bash
railway domain
# Copy the URL (e.g., https://calpro-backend-production.up.railway.app)
```

### 3. Update Frontend
- Replace demo mode with production API calls
- Update netlify.toml with real backend URL
- Commit and push to trigger Netlify deployment

### 4. Configure Environment
- Set production environment variables
- Configure database
- Test all functionality

## 💰 Cost Estimate

### Free Tier (Good for testing/small usage)
- **Railway**: $0/month (500 hours included)
- **Netlify**: $0/month (100GB bandwidth)
- **Total**: $0/month

### Production Tier (Recommended)
- **Railway Pro**: $5/month (unlimited hours)
- **Netlify Pro**: $19/month (1TB bandwidth)
- **Domain**: $12/year
- **Total**: ~$25/month

## 🔧 Environment Variables Needed

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-jwt-secret-key-here
DB_PATH=./production.db
ALLOWED_ORIGINS=https://your-app.netlify.app,https://calpro.yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (Netlify Environment Variables)
```env
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_ENV=production
```