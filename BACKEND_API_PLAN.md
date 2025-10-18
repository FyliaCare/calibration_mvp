# 🚀 Backend API Integration Plan

## Overview
Complete backend API development to replace all frontend mock data with real database-backed endpoints.

---

## 📋 Current Status

### Frontend (Complete ✅):
- 11 pages fully implemented
- 11,700+ lines of code
- 4 mock data files (~2,730 lines):
  - mockEquipment.ts (12 items)
  - mockClients.ts (8 items)
  - mockCalibrations.ts (15 items)
  - mockUsers.ts (12 items)

### Backend (In Progress ⏳):
- Basic server.js exists with calibration records endpoints
- SQLite database setup
- File upload handling
- Need to expand to cover all entities

---

## 🎯 Backend Development Strategy

### Phase 1: Database Schema Design
Create comprehensive SQLite schema for all entities:

**Tables to Create:**
1. **equipment** - Equipment master data
2. **clients** - Client/customer information
3. **client_contacts** - Client contact persons
4. **client_equipment** - Client-equipment assignments
5. **calibrations** - Calibration records
6. **users** - System users
7. **settings** - Application settings
8. **audit_log** - Activity tracking
9. **attachments** - File uploads

**Schema Details:**

```sql
-- Equipment Table
CREATE TABLE equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  model TEXT,
  manufacturer TEXT,
  category TEXT NOT NULL, -- electrical, pressure, temperature, etc.
  status TEXT DEFAULT 'active', -- active, calibration-due, maintenance, retired
  location TEXT,
  purchase_date DATE,
  last_calibration_date DATE,
  next_calibration_date DATE,
  calibration_interval INTEGER DEFAULT 12, -- months
  specifications TEXT, -- JSON
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients Table
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  contact_person TEXT,
  account_type TEXT DEFAULT 'standard', -- standard, premium, enterprise
  status TEXT DEFAULT 'active', -- active, inactive, pending
  total_revenue REAL DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Client Contacts Table
CREATE TABLE client_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  is_primary INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Client Equipment Assignments
CREATE TABLE client_equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  equipment_id INTEGER NOT NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  UNIQUE(client_id, equipment_id)
);

-- Calibrations Table
CREATE TABLE calibrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_number TEXT UNIQUE NOT NULL,
  equipment_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  calibration_date DATE NOT NULL,
  next_due_date DATE NOT NULL,
  technician_id INTEGER,
  technician_name TEXT,
  status TEXT DEFAULT 'pending', -- completed, pending, in-progress, failed, cancelled
  result TEXT DEFAULT 'pending', -- pass, fail, conditional, pending
  location TEXT DEFAULT 'in-lab', -- in-lab, on-site
  temperature REAL,
  humidity REAL,
  standard_name TEXT,
  standard_serial TEXT,
  standard_certificate TEXT,
  standard_expiry DATE,
  as_found TEXT, -- pass, fail, out-of-tolerance
  as_found_notes TEXT,
  as_left TEXT, -- pass, fail, adjusted
  as_left_notes TEXT,
  procedure TEXT,
  data_points INTEGER DEFAULT 0,
  notes TEXT,
  certificate_issued INTEGER DEFAULT 0,
  certificate_issued_date DATE,
  approved_by TEXT,
  approved_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'technician', -- admin, manager, technician, viewer
  department TEXT,
  status TEXT DEFAULT 'active', -- active, inactive
  phone TEXT,
  avatar TEXT,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL, -- JSON
  category TEXT, -- general, security, notifications, system, data, integrations
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Audit Log Table
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT, -- equipment, client, calibration, user, settings
  entity_id INTEGER,
  details TEXT, -- JSON
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Attachments Table
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL, -- calibration, equipment, client
  entity_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  file_path TEXT NOT NULL,
  uploaded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

---

### Phase 2: API Routes Structure

**Create Route Files:**

```
backend/
├── src/
│   ├── routes/
│   │   ├── equipment.js      ✅ CREATED
│   │   ├── clients.js        ✅ CREATED
│   │   ├── calibrations.js   ⏳ TODO
│   │   ├── users.js          ⏳ TODO
│   │   ├── reports.js        ⏳ TODO
│   │   ├── settings.js       ⏳ TODO
│   │   └── auth.js           ⏳ TODO
│   │
│   ├── middleware/
│   │   ├── auth.js           ⏳ TODO
│   │   ├── validation.js     ⏳ TODO
│   │   └── errorHandler.js   ⏳ TODO
│   │
│   ├── utils/
│   │   ├── database.js       ⏳ TODO
│   │   └── helpers.js        ⏳ TODO
│   │
│   └── app.js                ⏳ TODO (main server)
│
└── package.json              ⏳ TODO
```

---

### Phase 3: API Endpoints to Implement

#### **Equipment Endpoints** ✅ DONE
- GET /api/equipment - List with filters
- GET /api/equipment/stats - Statistics
- GET /api/equipment/:id - Single item
- POST /api/equipment - Create
- PUT /api/equipment/:id - Update
- DELETE /api/equipment/:id - Delete

#### **Clients Endpoints** ✅ DONE
- GET /api/clients - List with filters
- GET /api/clients/stats - Statistics
- GET /api/clients/:id - Single client with contacts
- POST /api/clients - Create
- PUT /api/clients/:id - Update
- DELETE /api/clients/:id - Delete
- POST /api/clients/:id/contacts - Add contact
- PUT /api/clients/:id/contacts/:contactId - Update contact
- DELETE /api/clients/:id/contacts/:contactId - Delete contact

#### **Calibrations Endpoints** ⏳ TODO
- GET /api/calibrations - List with filters
- GET /api/calibrations/stats - Statistics
- GET /api/calibrations/:id - Single record
- POST /api/calibrations - Create
- PUT /api/calibrations/:id - Update
- DELETE /api/calibrations/:id - Delete
- POST /api/calibrations/:id/approve - Approve certificate
- POST /api/calibrations/:id/generate-certificate - Generate PDF

#### **Users Endpoints** ⏳ TODO
- GET /api/users - List with filters
- GET /api/users/stats - Statistics
- GET /api/users/:id - Single user profile
- POST /api/users - Create
- PUT /api/users/:id - Update
- DELETE /api/users/:id - Delete
- PUT /api/users/:id/password - Change password
- GET /api/users/:id/activity - Activity log

#### **Authentication Endpoints** ⏳ TODO
- POST /api/auth/login - Login
- POST /api/auth/register - Register
- POST /api/auth/logout - Logout
- POST /api/auth/refresh - Refresh token
- GET /api/auth/me - Current user

#### **Reports Endpoints** ⏳ TODO
- GET /api/reports/overview - Overview statistics
- GET /api/reports/calibrations - Calibration report data
- GET /api/reports/equipment - Equipment report data
- GET /api/reports/clients - Client report data
- GET /api/reports/financial - Financial report data
- POST /api/reports/export - Export report (PDF, Excel, CSV)

#### **Settings Endpoints** ⏳ TODO
- GET /api/settings - Get all settings
- GET /api/settings/:category - Get category settings
- PUT /api/settings - Update settings
- POST /api/settings/backup - Create backup
- POST /api/settings/restore - Restore backup

---

### Phase 4: Frontend API Integration

**Create API Service Layer:**

```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Create API Service Files:**

```typescript
// frontend/src/api/equipment.ts
export const equipmentApi = {
  getAll: (params) => apiClient.get('/equipment', { params }),
  getStats: () => apiClient.get('/equipment/stats'),
  getById: (id) => apiClient.get(`/equipment/${id}`),
  create: (data) => apiClient.post('/equipment', data),
  update: (id, data) => apiClient.put(`/equipment/${id}`, data),
  delete: (id) => apiClient.delete(`/equipment/${id}`),
};

// frontend/src/api/clients.ts
export const clientsApi = {
  getAll: (params) => apiClient.get('/clients', { params }),
  getStats: () => apiClient.get('/clients/stats'),
  getById: (id) => apiClient.get(`/clients/${id}`),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`),
  addContact: (id, data) => apiClient.post(`/clients/${id}/contacts`, data),
  updateContact: (id, contactId, data) => apiClient.put(`/clients/${id}/contacts/${contactId}`, data),
  deleteContact: (id, contactId) => apiClient.delete(`/clients/${id}/contacts/${contactId}`),
};

// Similar for calibrations, users, reports, settings...
```

**Create TanStack Query Hooks:**

```typescript
// frontend/src/hooks/useEquipment.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentApi } from '@/api/equipment';

export function useEquipmentList(params) {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => equipmentApi.getAll(params),
  });
}

export function useEquipmentDetail(id) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: equipmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => equipmentApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', id] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: equipmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}
```

---

### Phase 5: Update Pages to Use API Hooks

**Example: EquipmentListPage.tsx**

```typescript
// BEFORE (with mock data):
import { mockEquipment, filterEquipment } from '@/data/mockEquipment';
const [equipment] = useState(mockEquipment);
const filtered = filterEquipment(equipment, { search, status, category });

// AFTER (with API):
import { useEquipmentList } from '@/hooks/useEquipment';
const { data, isLoading, error } = useEquipmentList({ search, status, category, page, limit });
const equipment = data?.data || [];

// Add loading state:
if (isLoading) return <EquipmentListSkeleton />;
if (error) return <ErrorState error={error} />;
```

---

### Phase 6: Add Loading & Error States

**Create Loading Components:**
- SkeletonCard
- SkeletonTable
- SkeletonDetail
- Spinner

**Create Error Components:**
- ErrorBoundary
- ErrorState
- Toast notifications

**Example:**
```typescript
{isLoading && <Skeleton count={5} />}
{error && <ErrorState message={error.message} onRetry={refetch} />}
{data && <DataTable data={data} />}
```

---

## 🗂️ Implementation Checklist

### Database (Priority 1):
- [ ] Create comprehensive schema (all 9 tables)
- [ ] Add indexes for performance
- [ ] Create seed data script
- [ ] Add migrations support

### Backend Routes (Priority 2):
- [x] Equipment routes (DONE)
- [x] Clients routes (DONE)
- [ ] Calibrations routes
- [ ] Users routes
- [ ] Authentication routes
- [ ] Reports routes
- [ ] Settings routes

### Frontend API Layer (Priority 3):
- [ ] Create API client configuration
- [ ] Create all API service files (7 files)
- [ ] Create TanStack Query hooks (7 files)
- [ ] Setup error handling
- [ ] Setup auth interceptors

### Frontend Page Updates (Priority 4):
- [ ] Update EquipmentListPage
- [ ] Update EquipmentDetailPage
- [ ] Update ClientListPage
- [ ] Update ClientDetailPage
- [ ] Update CalibrationListPage
- [ ] Update CalibrationDetailPage
- [ ] Update ReportsPage
- [ ] Update UsersListPage
- [ ] Update ProfilePage
- [ ] Update SettingsPage
- [ ] Update DashboardPage

### Loading & Error States (Priority 5):
- [ ] Create skeleton components
- [ ] Create error boundary
- [ ] Add toast notifications
- [ ] Add retry mechanisms
- [ ] Add optimistic updates

### Cleanup (Priority 6):
- [ ] Delete mockEquipment.ts
- [ ] Delete mockClients.ts
- [ ] Delete mockCalibrations.ts
- [ ] Delete mockUsers.ts
- [ ] Verify no import errors
- [ ] Test all pages end-to-end

---

## 📊 Estimated Timeline

- **Database Schema**: 2-3 hours
- **Backend Routes**: 6-8 hours (5 route files remaining)
- **Frontend API Layer**: 3-4 hours
- **Page Updates**: 4-6 hours (11 pages)
- **Loading/Error States**: 2-3 hours
- **Testing & Cleanup**: 2-3 hours

**Total**: 19-27 hours of development

---

## 🚀 Next Immediate Steps

1. **Create Database Schema** - Complete all 9 tables
2. **Finish Remaining Routes** - Calibrations, Users, Auth, Reports, Settings
3. **Create Main Server File** - Wire up all routes
4. **Test Backend APIs** - Use Postman/curl to verify endpoints
5. **Create Frontend API Layer** - API client + service files
6. **Create Query Hooks** - TanStack Query hooks for all entities
7. **Update Pages One by One** - Start with Equipment, then Clients, etc.
8. **Add Loading/Error UI** - Polish the user experience
9. **Delete Mock Data** - Final cleanup
10. **End-to-End Testing** - Verify everything works

---

## 💡 Pro Tips

1. **Start Small**: Get one entity (Equipment) fully working end-to-end before moving to the next
2. **Test As You Go**: Use Postman to test each endpoint immediately after creating it
3. **Error Handling**: Add comprehensive error handling from the start
4. **Loading States**: Add skeleton loaders to make the app feel faster
5. **Optimistic Updates**: Update UI immediately, sync with backend in background
6. **Cache Invalidation**: Use TanStack Query's invalidation properly
7. **Type Safety**: Keep TypeScript strict types throughout
8. **Git Commits**: Commit after each complete feature

---

## 🎯 Success Criteria

- ✅ All mock data files deleted
- ✅ All pages fetching real data from backend
- ✅ Create, update, delete operations working
- ✅ Loading states on all pages
- ✅ Error handling with user-friendly messages
- ✅ No console errors
- ✅ TypeScript compiles with no errors
- ✅ All routes tested and working
- ✅ Backend handles edge cases gracefully
- ✅ Production-ready authentication

---

**Ready to build a production-grade calibration management system!** 🚀
