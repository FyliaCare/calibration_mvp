# 🚀 CalPro Calibration System - Backend API v2.0

Modern, type-safe REST API built with Express, TypeScript, and Prisma.

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Logging**: Winston

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

## 🚀 Development

```bash
# Start development server with hot reload
npm run dev

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

The API will be available at `http://localhost:3001/api`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build & Production

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "Password123",
     "name": "John Doe"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "admin@calpro.com",
     "password": "Admin@123"
   }
   ```
   Returns:
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGc...",
       "user": {
         "id": "...",
         "email": "admin@calpro.com",
         "name": "Admin User",
         "role": "ADMIN"
       }
     }
   }
   ```

3. **Protected Requests**: Include access token in header
   ```
   Authorization: Bearer <accessToken>
   ```

4. **Refresh Token**: `POST /api/auth/refresh`
   ```json
   {
     "refreshToken": "..."
   }
   ```

## 🗃️ Database Schema

### Users
- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `passwordHash`: Bcrypt hashed password
- `name`: User full name
- `role`: ADMIN | MANAGER | TECHNICIAN | USER
- `isActive`: Account status
- `emailVerified`: Email verification status
- `lastLogin`: Last login timestamp

### Equipment
- `id`: Unique identifier
- `equipmentId`: Custom ID (e.g., "CAL-001")
- `name`: Equipment name
- `manufacturer`, `model`, `serialNumber`
- `category`: PRESSURE | TEMPERATURE | ELECTRICAL | etc.
- `calibrationInterval`: Days between calibrations
- `status`: ACTIVE | INACTIVE | IN_SERVICE | etc.
- `clientId`: Foreign key to Client

### Clients
- `id`: Unique identifier
- `companyName`: Company name
- `contactName`, `email`, `phone`
- `address`, `city`, `state`, `zipCode`
- `industry`: Industry type

### Calibration Records
- `id`: Unique identifier
- `recordNumber`: Custom record ID
- `equipmentId`: Foreign key to Equipment
- `calibrationDate`, `nextDueDate`
- `technicianId`: Foreign key to User
- `result`: PASS | PASS_WITH_ADJUSTMENT | FAIL | LIMITED
- `certificateNumber`, `certificateUrl`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3001 |
| `DATABASE_URL` | Database connection string | file:./dev.db |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |
| `LOG_LEVEL` | Logging level | info |

## 🏗️ Project Structure

```
backend-v2/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration files
│   └── seed.ts            # Database seeding
├── src/
│   ├── config/            # Configuration files
│   │   ├── env.ts         # Environment variables
│   │   ├── database.ts    # Prisma client
│   │   └── logger.ts      # Winston logger
│   ├── controllers/       # Route controllers
│   │   └── auth.controller.ts
│   ├── services/          # Business logic
│   │   └── auth.service.ts
│   ├── routes/            # API routes
│   │   ├── index.ts
│   │   └── auth.routes.ts
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts        # Authentication
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── validators/        # Zod schemas
│   │   └── auth.validators.ts
│   ├── utils/             # Helper functions
│   │   └── auth.ts
│   ├── types/             # TypeScript types
│   └── server.ts          # Entry point
├── tests/                 # Test files
├── logs/                  # Log files
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🔒 Security Features

✅ **Password Security**: Bcrypt hashing with 10 rounds  
✅ **JWT Tokens**: Short-lived access tokens (15min)  
✅ **Refresh Tokens**: Secure refresh token rotation  
✅ **Rate Limiting**: Prevent brute force attacks  
✅ **Input Validation**: Zod schemas on all endpoints  
✅ **SQL Injection**: Prisma parameterized queries  
✅ **XSS Protection**: Helmet middleware  
✅ **CORS**: Configured for specific origins  

## 📝 Default Credentials

After running seed:
- **Email**: admin@calpro.com
- **Password**: Admin@123
- **Role**: ADMIN

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage
```

## 📊 Database Migrations

```bash
# Create a new migration
npm run prisma:migrate -- --name migration_name

# Reset database (WARNING: deletes all data)
npm run prisma:reset

# Apply migrations in production
npx prisma migrate deploy
```

## 🐛 Debugging

```bash
# View database with Prisma Studio
npm run prisma:studio

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Set environment variables
4. Connect GitHub repository
5. Deploy!

Environment variables for production:
```bash
NODE_ENV=production
DATABASE_URL=<railway-postgres-url>
JWT_ACCESS_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
CORS_ORIGIN=<frontend-url>
```

## 📚 Next Features to Implement

- [ ] Equipment CRUD operations
- [ ] Client management
- [ ] Calibration records
- [ ] Dashboard statistics
- [ ] File upload for certificates
- [ ] Email notifications
- [ ] PDF certificate generation
- [ ] Advanced search & filtering
- [ ] Audit logging
- [ ] User management (admin panel)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit pull request

## 📄 License

MIT
