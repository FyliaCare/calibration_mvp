# 🚀 CalPro Calibration System v2.0 - Quick Start Guide

## ✅ Backend Status: RUNNING

The new modern backend is now operational!

### 🔗 Backend Endpoints

- **Base URL**: `http://localhost:3001/api`
- **Health Check**: `http://localhost:3001/api/health`
- **Documentation**: See backend-v2/README.md

### 🔐 Default Credentials

- **Email**: `admin@calpro.com`
- **Password**: `Admin@123`
- **Role**: ADMIN

### 🧪 Test the API

#### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

#### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@calpro.com\",\"password\":\"Admin@123\"}"
```

#### 3. Get Profile (with token from login)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📦 What's Been Completed

### ✅ Backend (backend-v2/)
- [x] Modern Express.js + TypeScript architecture
- [x] Prisma ORM with SQLite database
- [x] JWT authentication with refresh tokens
- [x] Role-based access control (ADMIN, MANAGER, TECHNICIAN, USER)
- [x] Password hashing with bcrypt
- [x] Request validation with Zod
- [x] Error handling middleware
- [x] Security (Helmet, CORS, Rate Limiting)
- [x] Winston logger
- [x] Database migrations
- [x] Seed data (admin user + sample client/equipment)

### 📋 API Endpoints Implemented
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `GET /api/health` - Health check

## 🎯 Next Steps

### Phase 1: React Frontend (In Progress)
- [ ] Create React app with Vite + TypeScript
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Implement React Router
- [ ] Create authentication context
- [ ] Build login/register pages
- [ ] Build dashboard layout
- [ ] Connect to backend API

### Phase 2: Core Features
- [ ] Equipment CRUD operations
- [ ] Client management
- [ ] Calibration records
- [ ] Dashboard statistics
- [ ] Search & filtering
- [ ] Pagination

### Phase 3: Advanced Features
- [ ] Calibration scheduling
- [ ] Certificate generation (PDF)
- [ ] Email notifications
- [ ] Reports & exports
- [ ] Audit logging
- [ ] User management (admin panel)

## 🏗️ Project Structure

```
calibration-mvp/
├── backend-v2/          ✅ NEW MODERN BACKEND (Running on :3001)
│   ├── src/
│   │   ├── config/      Config files (env, database, logger)
│   │   ├── controllers/ Route controllers
│   │   ├── services/    Business logic
│   │   ├── routes/      API routes
│   │   ├── middleware/  Auth, validation, error handling
│   │   ├── validators/  Zod schemas
│   │   ├── utils/       Helper functions
│   │   └── server.ts    Entry point
│   ├── prisma/
│   │   ├── schema.prisma Database schema
│   │   ├── migrations/  Migration files
│   │   └── seed.ts      Seed script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/           🔜 NEXT: React + Vite + TypeScript
│   └── (To be created)
│
├── backend/            🗑️ OLD BACKEND (Can be archived)
├── public/             🗑️ OLD FRONTEND (Can be archived)
│
├── REDESIGN_PLAN.md    📄 Complete architecture plan
└── QUICKSTART.md       📄 This file
```

## 💻 Development Commands

### Backend
```bash
cd backend-v2

# Development (hot reload)
npm run dev

# Database
npm run prisma:studio      # Open database GUI
npm run prisma:migrate     # Create migration
npm run prisma:seed        # Seed database

# Code Quality
npm run lint               # Check code
npm run format             # Format code
npm run type-check         # TypeScript check

# Testing
npm test                   # Run tests
npm run test:coverage      # Coverage report
```

### Frontend (Coming Next)
```bash
cd frontend

# Development
npm run dev

# Build
npm run build
npm run preview

# Testing
npm test
```

## 🔧 Environment Variables

Backend (backend-v2/.env):
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET=dev-access-secret-...
JWT_REFRESH_SECRET=dev-refresh-secret-...
CORS_ORIGIN=http://localhost:3000
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend-v2
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Database issues
```bash
cd backend-v2
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### TypeScript errors
```bash
cd backend-v2
npm run type-check
```

## 📚 Documentation

- **Backend API**: See `backend-v2/README.md`
- **Architecture**: See `REDESIGN_PLAN.md`
- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com

## 🎓 Tech Stack

### Backend
- Node.js 20 + Express.js
- TypeScript (strict mode)
- Prisma ORM + SQLite
- JWT + bcrypt
- Zod validation
- Winston logger
- Vitest testing

### Frontend (Next Phase)
- React 18 + TypeScript
- Vite build tool
- React Router v6
- Tailwind CSS + shadcn/ui
- Zustand state management
- Axios API client
- React Hook Form + Zod

## 🚀 Deployment (Future)

### Railway
1. Push code to GitHub
2. Create Railway project
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

---

**Status**: Backend Complete ✅ | Frontend In Progress 🚧  
**Version**: 2.0.0  
**Last Updated**: October 17, 2025
