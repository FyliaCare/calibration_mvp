# 🚀 CalPro Deployment Guide

## Quick Deployment Checklist

### ✅ Files Organized
- [x] Frontend files in `/public`
- [x] Backend files in `/backend`
- [x] Removed unnecessary files
- [x] Created `netlify.toml`
- [x] Updated `package.json`

### 📦 Netlify Deployment

1. **Repository Setup**
   ```bash
   git add .
   git commit -m "Organized for Netlify deployment"
   git push origin main
   ```

2. **Netlify Configuration**
   - Build command: `npm run build`
   - Publish directory: `public`
   - Node version: 18

3. **Domain Setup**
   - Custom domain: `calpro-calibration.netlify.app`
   - SSL enabled automatically

### 🎯 What's Optimized

- **Frontend Only**: No backend dependencies in main deployment
- **Offline First**: Works without internet using IndexedDB
- **Clean Structure**: No development files, backups, or databases
- **Fast Loading**: Static files only, CDN cached
- **PWA Ready**: Service worker for offline functionality

### 🔧 Backend (Optional)

Deploy backend separately to:
- Heroku (recommended)
- Railway
- Vercel (serverless)
- Your own VPS

Update API endpoints in `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend.herokuapp.com/api/:splat"
  status = 200
  force = true
```

### 📱 Features Working Offline

- ✅ Certificate creation
- ✅ Data entry and editing
- ✅ PDF generation
- ✅ Digital signatures
- ✅ Local storage
- ✅ Equipment database
- ✅ Client management
- ✅ Unit converter
- ✅ All calculations

### 🌐 Production URLs

- **Frontend**: https://calpro-calibration.netlify.app
- **Repository**: https://github.com/jaymonty/calpro-calibration-system
- **Backend**: Deploy separately (optional)

## Support

For deployment issues, check:
1. Netlify build logs
2. Browser console for errors
3. Service worker registration
4. PWA installation prompts