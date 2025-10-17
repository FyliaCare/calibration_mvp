# 🚀 CalPro - Professional Calibration Management System

## ✅ Status: PRODUCTION READY

Complete calibration management platform with authentication, client management, equipment tracking, and PWA functionality.

### 🎯 **Features**
- ✅ **Authentication System**: JWT-based with admin/user roles
- ✅ **Client Management**: Full CRUD operations with industry tracking
- ✅ **Equipment Database**: Calibration scheduling and status tracking
- ✅ **Certificate Management**: Generation and digital signatures
- ✅ **Progressive Web App**: Offline functionality and mobile support
- ✅ **Professional UI**: Consistent light theme across all pages
- ✅ **Admin Dashboard**: Analytics and user management

### 📁 **Project Structure**
```
calibration_mvp/
├── 📂 backend/               # Production Node.js API
│   ├── server-auth.js       # Main server (JWT auth + APIs)
│   ├── migrate-db.js        # Database setup/migration
│   ├── package.json         # Dependencies
│   └── calibration.db       # SQLite database
├── 📂 public/               # Frontend PWA
│   ├── index.html          # Login page
│   ├── login.html          # Dashboard
│   ├── clients.html        # Client management
│   ├── equipment.html      # Equipment tracking
│   ├── profile.html        # User profile
│   └── styles.css          # Professional styling
├── netlify.toml            # Frontend deployment
├── railway.json            # Backend deployment
└── README.md               # This file
```

## 🚀 **Deploy to Production**

### **Option 1: Railway + Netlify (Recommended)**

#### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy backend
cd "c:\Users\Jay Monty\Desktop\Projects\calibration_mvp"
railway init
railway up
```

#### Frontend (Netlify):
```bash
# Install Netlify CLI
npm install -g netlify-cli
netlify login

# Deploy frontend
netlify init
netlify deploy --prod --dir=public
```

### **Option 2: GitHub Integration**
1. Push to GitHub: `git push origin main`
2. Railway: New Project → Deploy from GitHub
3. Netlify: New Site → Deploy from GitHub

## 🎉 **What You Get**

**Live URLs:**
- Backend API: `https://your-backend.up.railway.app`
- Frontend App: `https://your-frontend.netlify.app`

**Admin Access:**
- Email: `admin@calpro.com`
- Password: `admin123`
- ⚠️ **Change these after first login!**

**APIs Ready:**
- `/api/auth/*` - Authentication endpoints
- `/api/clients/*` - Client management
- `/api/equipment/*` - Equipment tracking
- `/api/health` - Health check

## 💰 **Hosting Costs**
- **Railway**: $5/month (includes database)
- **Netlify**: Free tier (100GB bandwidth)
- **Total**: ~$5/month

## 🔧 **Environment Variables**

**Railway (Backend):**
```
NODE_ENV=production
JWT_SECRET=your-secure-secret-key
HOST=0.0.0.0
```

**Optional Email:**
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
```

## 🧪 **Test Your Deployment**

```bash
# Health check
curl https://your-backend.up.railway.app/api/health

# Login test
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@calpro.com","password":"admin123"}'
```

## 📱 **PWA Installation**
1. Visit your Netlify URL in Chrome/Edge/Safari
2. Click "Install" in address bar
3. App installs like native application
4. Works offline with full functionality

## 🛠️ **Local Development**

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
npx serve public
```

## 🔒 **Security Features**
- JWT authentication with session management
- CORS protection for production domains
- Input validation and SQL injection protection
- Password hashing with bcrypt
- Role-based access control

## 🆘 **Troubleshooting**

**Health Check Failing?**
- ✅ Server binds to `0.0.0.0` (Railway compatible)
- ✅ Database auto-migrates on startup
- ✅ All endpoints properly configured

**Database Issues?**
- Run: `cd backend && npm run migrate`
- SQLite database creates automatically
- All tables configured with proper schema

---

## 🎯 **Ready to Deploy!**

Your system includes:
- Complete authentication & user management
- Professional calibration management features
- Mobile PWA with offline capabilities
- Production-ready deployment configuration

**Deployment time: ~10 minutes**  
**Cost: ~$5/month**  
**Support: All features tested and working**