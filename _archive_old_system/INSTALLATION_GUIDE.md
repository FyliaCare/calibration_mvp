# Installation & Setup Guide

## 🚀 Complete Installation Instructions

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd "c:\Users\Jay Monty\Desktop\Projects\calibration_mvp"

# Install all dependencies
npm install
```

This will install:
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **jsPDF** - PDF generation
- **jsdom** - DOM testing environment

### Step 2: Verify Installation

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0
```

### Step 3: Run Tests

```bash
# Run all tests
npm test

# Expected output:
# ✓ Date Formatters (8 tests)
# ✓ Number Formatters (9 tests)
# ✓ Validators (12 tests)
# Test Files  3 passed (3)
# Tests  29 passed (29)
```

### Step 4: Start Development Server

```bash
# Start dev server with hot reload
npm run dev

# Should open http://localhost:3000 automatically
# If not, manually open in browser
```

### Step 5: Build for Production

```bash
# Create production build
npm run build

# Output will be in dist/ folder
# Check build size:
# ✓ built in [time]
# dist/index.html                   [size] kB
# dist/assets/vendor-[hash].js      [size] kB
# dist/assets/utils-[hash].js       [size] kB
# dist/assets/features-[hash].js    [size] kB
# dist/assets/main-[hash].js        [size] kB
```

### Step 6: Preview Production Build

```bash
# Preview production build locally
npm run preview

# Open http://localhost:4173
```

---

## 🧪 Testing Guide

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with UI
```bash
npm run test:ui
# Opens interactive test UI in browser
```

### Generate Coverage Report
```bash
npm run test:coverage
# Creates coverage/ folder
# Open coverage/index.html in browser
```

### Run Specific Test File
```bash
npm test tests/utils/date-formatters.test.ts
```

---

## 🔍 Code Quality

### Lint Code
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix
```

### Format Code
```bash
# Format all files with Prettier
npm run format
```

### Type Check
```bash
# Run TypeScript type checking
npm run type-check
```

---

## 🌐 Deployment

### Deploy to Netlify

#### Option 1: Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option 2: Automated (CI/CD)
```bash
# Push to main branch
git add .
git commit -m "Ready for production"
git push origin main

# GitHub Actions will automatically:
# 1. Run tests
# 2. Build project
# 3. Deploy to Netlify
```

### Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize and deploy
railway init
railway up
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:
```bash
# Backend API URL
VITE_API_URL=http://localhost:3001

# Or production URL
VITE_API_URL=https://your-backend.railway.app
```

### Backend Configuration

In `backend/` folder, create `.env`:
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key-here
DATABASE_URL=./calibration.db
```

---

## 📁 Project Scripts

### Development
- `npm run dev` - Start dev server (port 3000)
- `npm test` - Run tests
- `npm run test:ui` - Test UI
- `npm run test:coverage` - Coverage report

### Build
- `npm run build` - Production build
- `npm run preview` - Preview build

### Code Quality
- `npm run lint` - Check code
- `npm run lint:fix` - Fix issues
- `npm run format` - Format code
- `npm run type-check` - Check types

### Deployment
- `npm run deploy` - Build & deploy to Netlify

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
npm run dev -- --port 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Clear Vitest cache
rm -rf node_modules/.vitest
npm test
```

### Build Errors
```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint

# Clear dist folder
rm -rf dist
npm run build
```

### Git Push Failing
```bash
# Check CI/CD status
# View workflow logs in GitHub Actions

# If tests fail locally:
npm test
npm run lint
npm run type-check

# Fix issues before pushing
```

---

## 📚 Additional Resources

### Documentation Files
- `COMPLETE_RESTRUCTURING_SUMMARY.md` - Full overview
- `MODERN_DEV_SETUP_COMPLETE.md` - Dev setup details
- `TESTING_CHECKLIST.md` - Testing guide
- `CSS_MODULARIZATION_COMPLETE.md` - CSS architecture
- `JAVASCRIPT_MODULARIZATION_COMPLETE.md` - JS architecture

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript settings
- `vite.config.js` - Build configuration
- `vitest.config.js` - Test configuration
- `.eslintrc.cjs` - Linting rules
- `.prettierrc.json` - Formatting rules
- `.github/workflows/ci-cd.yml` - CI/CD pipeline

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Tests pass (`npm test` shows all green)
- [ ] Dev server starts (`npm run dev` opens browser)
- [ ] Build succeeds (`npm run build` creates `dist/`)
- [ ] Linter passes (`npm run lint` shows no errors)
- [ ] Type check passes (`npm run type-check` succeeds)
- [ ] Preview works (`npm run preview` opens browser)

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Start dev server
4. ⏳ Add more test coverage
5. ⏳ Set up GitHub secrets for CI/CD
6. ⏳ Deploy to staging
7. ⏳ Deploy to production

---

## 📞 Need Help?

- Check documentation files in project root
- Review GitHub Actions logs for CI/CD issues
- Check browser console for runtime errors
- Check terminal output for build errors

**Everything is set up and ready to go!** 🚀
