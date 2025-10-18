# 🎨 CalPro Calibration System - React Frontend

Modern React frontend built with TypeScript, Vite, Tailwind CSS, and React Router.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🚀 Development

```bash
# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🏗️ Build & Production

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client & endpoints
│   │   ├── client.ts     # Axios instance with interceptors
│   │   └── auth.ts       # Auth API methods
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/       # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── stores/           # Zustand stores
│   │   └── authStore.ts
│   ├── lib/              # Utility functions
│   │   └── utils.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Access token stored in memory (Zustand)
3. Refresh token stored in localStorage
4. API requests include Bearer token
5. 401 responses trigger token refresh
6. Logout clears all auth state

## 📄 Pages

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require authentication)
- `/dashboard` - Dashboard home
- `/dashboard/equipment` - Equipment management
- `/dashboard/clients` - Client management
- `/dashboard/calibrations` - Calibration records
- `/dashboard/reports` - Reports & analytics
- `/dashboard/users` - User management (admin only)
- `/dashboard/settings` - System settings (admin only)

## 🎨 UI Components

### Button
```tsx
<Button variant="default" size="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>
```

### Input
```tsx
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

### Vite Config
- Proxy: `/api/*` → `http://localhost:3001`
- Port: 3000
- Path alias: `@` → `./src`

## 🧪 State Management

### Auth Store (Zustand)
```tsx
const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Server State (React Query)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['equipment'],
  queryFn: () => equipmentApi.getAll(),
});
```

## 🔌 API Integration

### Auth API
```tsx
import { authApi } from '@/api/auth';

// Login
const response = await authApi.login({ email, password });

// Get profile
const user = await authApi.getProfile();

// Logout
await authApi.logout();
```

### Axios Interceptors
- **Request**: Adds Bearer token
- **Response**: Handles 401 errors, refreshes token

## 🎨 Styling

### Tailwind CSS
- Configured with custom colors
- Dark mode support (class-based)
- Responsive utilities

### CSS Variables
```css
--primary: 221.2 83.2% 53.3%;
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Railway/Netlify/Vercel
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables

## 📊 Features

### Implemented ✅
- User authentication (login/register)
- Protected routes
- Token refresh mechanism
- Dashboard layout with sidebar
- Responsive design
- Error handling
- Loading states

### Coming Soon 🚧
- Equipment CRUD operations
- Client management
- Calibration records
- Data tables with pagination
- Search & filtering
- Reports & exports
- Dark mode toggle
- Notifications

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port in vite.config.ts or:
npm run dev -- --port 3001
```

### TypeScript errors
```bash
npm run type-check
```

### Clear cache
```bash
rm -rf node_modules dist
npm install
```

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)

---

**Version**: 2.0.0  
**Status**: In Development 🚧
