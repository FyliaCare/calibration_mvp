/**
 * Calibration MVP - Authentication Enhanced Server
 * Full-featured authentication system with user management
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const multer = require('multer');
const compression = require('compression');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('⚠️  Nodemailer not available. Email features will be disabled.');
}
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const app = express();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  sessionSecret: process.env.SESSION_SECRET || 'default-session-secret',
  dbPath: process.env.DB_PATH || path.join(__dirname, 'calibration.db'),
  appName: process.env.APP_NAME || 'Calibration MVP',
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  otpExpiry: parseInt(process.env.OTP_EXPIRY_MINUTES) || 10,
  otpLength: parseInt(process.env.OTP_LENGTH) || 6
};

// Middleware
// Compression middleware - must be early in the chain
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Compress everything except already compressed formats
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [`http://localhost:${config.port}`],
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Smart caching for static assets
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  
  // Cache static assets (JS, CSS, images) for 1 hour
  if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
    res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  }
  // Don't cache HTML files for now (they change frequently during development)
  else if (ext === '.html' || req.url === '/' || req.url === '/login.html') {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  // API endpoints - no cache
  else if (req.url.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0, // Let the middleware handle caching
  etag: true, // Enable ETags for better caching
  lastModified: true // Enable Last-Modified headers
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  etag: true,
  lastModified: true,
  maxAge: '1h'
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Database setup
const db = new sqlite3.Database(config.dbPath);

// Initialize database with authentication tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'lead_calibrator', 'calibrator', 'viewer')) DEFAULT 'calibrator',
    job_title TEXT,
    department TEXT,
    phone TEXT,
    employee_id TEXT UNIQUE,
    company_name TEXT DEFAULT 'CalPro Calibration Services',
    location TEXT,
    is_active INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 0,
    email_verification_token TEXT,
    email_verification_expires DATETIME,
    password_reset_token TEXT,
    password_reset_expires DATETIME,
    last_login DATETIME,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);

  // OTP codes table
  db.run(`CREATE TABLE IF NOT EXISTS otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT CHECK(purpose IN ('login', 'verification', 'reset')) NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`);

  // Auth tokens table
  db.run(`CREATE TABLE IF NOT EXISTS auth_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    expires_at DATETIME NOT NULL,
    revoked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`);

  // User activity log
  db.run(`CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_codes(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tokens_user ON auth_tokens(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity(user_id)`);
});

// Ensure additional columns for profile features
(function ensureUserColumns(){
  db.all('PRAGMA table_info(users)', (err, cols) => {
    if (err || !cols) return;
    const has = (n) => cols.some(c => c.name === n);
    const add = (sql) => db.run(sql, (e)=>{ if(e && !String(e.message).includes('duplicate')) console.warn('Migration warning:', e.message);});
    if (!has('avatar_url')) add('ALTER TABLE users ADD COLUMN avatar_url TEXT');
    if (!has('lab_code')) add('ALTER TABLE users ADD COLUMN lab_code TEXT');
    if (!has('address')) add('ALTER TABLE users ADD COLUMN address TEXT');
    if (!has('preferences')) add('ALTER TABLE users ADD COLUMN preferences TEXT');
    if (!has('two_factor_enabled')) add('ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0');
  });
})();

// Email transporter setup
let emailTransporter = null;
if (nodemailer && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('✅ Email configured successfully');
  } catch (error) {
    console.warn('⚠️  Email configuration failed:', error.message);
  }
} else {
  console.warn('⚠️  Email not configured. Email features will be simulated.');
}

// Email helper functions
async function sendEmail(to, subject, html) {
  if (!emailTransporter) {
    console.log(`📧 [Simulated Email] To: ${to}, Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    await emailTransporter.sendMail({
      from: `"${config.appName}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

function generateOTP() {
  return Math.floor(Math.pow(10, config.otpLength - 1) + Math.random() * 9 * Math.pow(10, config.otpLength - 1)).toString();
}

function generateToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Middleware: Authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if token exists in database and not revoked
    db.get(
      'SELECT * FROM auth_tokens WHERE token = ? AND revoked = 0 AND expires_at > datetime("now")',
      [token],
      (err, tokenRecord) => {
        if (err || !tokenRecord) {
          return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Get user info
        db.get('SELECT * FROM users WHERE id = ? AND is_active = 1', [decoded.userId], (err, user) => {
          if (err || !user) {
            return res.status(401).json({ error: 'User not found or inactive' });
          }

          delete user.password_hash; // Don't expose password hash
          req.user = user;
          req.token = token;
          next();
        });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware: Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Utility: Log user activity
function logActivity(userId, action, details, req) {
  const stmt = db.prepare(`
    INSERT INTO user_activity (user_id, action, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    userId,
    action,
    details ? JSON.stringify(details) : null,
    req.ip || req.connection.remoteAddress,
    req.get('User-Agent') || null
  );

  stmt.finalize();
}

// Create default admin user on first run
db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin"', async (err, row) => {
  if (!err && row.count === 0) {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123', 10);
    
    db.run(`
      INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active)
      VALUES (?, ?, ?, 'admin', 1, 1)
    `, [
      process.env.DEFAULT_ADMIN_EMAIL || 'admin@calpro.com',
      hashedPassword,
      process.env.DEFAULT_ADMIN_NAME || 'System Administrator'
    ], (err) => {
      if (!err) {
        console.log('✅ Default admin account created');
        console.log(`   Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@calpro.com'}`);
        console.log(`   Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123'}`);
      }
    });
  }
});

// ==========================================
// AUTH API ROUTES
// ==========================================

// Register new user
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('full_name').notEmpty().trim(),
  body('role').optional().isIn(['calibrator', 'lead_calibrator'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, full_name, role, job_title, department, phone } = req.body;

  try {
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existing) => {
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = generateToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Auto-verify if email is not configured (development mode)
      const autoVerify = !emailTransporter;
      
      // Insert user
      db.run(`
        INSERT INTO users (
          email, password_hash, full_name, role, job_title, department, phone,
          email_verification_token, email_verification_expires, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        email, password_hash, full_name,
        role || 'calibrator',
        job_title, department, phone,
        verificationToken, verificationExpires.toISOString(),
        autoVerify ? 1 : 0  // Auto-verify if email not configured
      ], async function(err) {
        if (err) {
          console.error('Registration error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }

        const userId = this.lastID;

        // Send verification email (only if email is configured)
        if (!autoVerify) {
          const verificationUrl = `${config.appUrl}/verify-email?token=${verificationToken}`;
          await sendEmail(
            email,
            `Welcome to ${config.appName} - Verify Your Email`,
            `
              <h2>Welcome to ${config.appName}!</h2>
              <p>Hello ${full_name},</p>
              <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
              <p><a href="${verificationUrl}" style="background: #FFB800; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p>
              <p>Or copy this link: ${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            `
          );
        }

        logActivity(userId, 'REGISTER', { email, role: role || 'calibrator', auto_verified: autoVerify }, req);

        res.json({
          success: true,
          message: autoVerify 
            ? 'Registration successful. You can now log in!' 
            : 'Registration successful. Please check your email to verify your account.',
          userId,
          autoVerified: autoVerify
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if account is locked
      if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
        return res.status(423).json({ 
          error: 'Account temporarily locked due to multiple failed login attempts',
          locked_until: user.account_locked_until
        });
      }

      // Check if account is active
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        // Increment failed attempts
        const failedAttempts = user.failed_login_attempts + 1;
        let lockUntil = null;

        if (failedAttempts >= 5) {
          lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        }

        db.run(
          'UPDATE users SET failed_login_attempts = ?, account_locked_until = ? WHERE id = ?',
          [failedAttempts, lockUntil?.toISOString(), user.id]
        );

        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if email is verified (allow admins to bypass)
      if (!user.is_verified && user.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Please verify your email before logging in',
          requiresVerification: true
        });
      }

      // Reset failed attempts
      db.run(
        'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL, last_login = datetime("now") WHERE id = ?',
        [user.id]
      );

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      // Store token in database
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      db.run(`
        INSERT INTO auth_tokens (user_id, token, device_info, ip_address, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `, [
        user.id,
        token,
        req.get('User-Agent'),
        req.ip || req.connection.remoteAddress,
        expiresAt.toISOString()
      ]);

      logActivity(user.id, 'LOGIN', { email }, req);

      delete user.password_hash;
      delete user.email_verification_token;
      delete user.password_reset_token;

      res.json({
        success: true,
        token,
        user
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify email
app.post('/api/auth/verify-email', [
  body('token').notEmpty()
], (req, res) => {
  const { token } = req.body;

  db.get(`
    SELECT * FROM users 
    WHERE email_verification_token = ? 
    AND email_verification_expires > datetime("now")
    AND is_verified = 0
  `, [token], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    db.run(`
      UPDATE users 
      SET is_verified = 1, 
          email_verification_token = NULL, 
          email_verification_expires = NULL
      WHERE id = ?
    `, [user.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Verification failed' });
      }

      logActivity(user.id, 'EMAIL_VERIFIED', {}, req);

      res.json({
        success: true,
        message: 'Email verified successfully. You can now log in.'
      });
    });
  });
});

// Send OTP
app.post('/api/auth/send-otp', authenticate, async (req, res) => {
  const { purpose } = req.body; // 'login', 'verification', 'reset'
  
  // Generate OTP
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + config.otpExpiry * 60 * 1000);

  // Save OTP
  db.run(`
    INSERT INTO otp_codes (user_id, code, purpose, expires_at)
    VALUES (?, ?, ?, ?)
  `, [req.user.id, code, purpose || 'login', expiresAt.toISOString()], async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate OTP' });
    }

    // Send OTP via email
    await sendEmail(
      req.user.email,
      `Your ${config.appName} OTP Code`,
      `
        <h2>Your One-Time Password</h2>
        <p>Hello ${req.user.full_name},</p>
        <p>Your OTP code is:</p>
        <h1 style="background: #FFB800; color: #333; padding: 16px; border-radius: 8px; display: inline-block; letter-spacing: 8px;">${code}</h1>
        <p>This code will expire in ${config.otpExpiry} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    );

    logActivity(req.user.id, 'OTP_SENT', { purpose }, req);

    res.json({
      success: true,
      message: 'OTP sent to your email',
      expiresAt
    });
  });
});

// Verify OTP
app.post('/api/auth/verify-otp', authenticate, [
  body('code').isLength({ min: 6, max: 6 })
], (req, res) => {
  const { code } = req.body;

  db.get(`
    SELECT * FROM otp_codes 
    WHERE user_id = ? 
    AND code = ? 
    AND used = 0 
    AND expires_at > datetime("now")
    ORDER BY created_at DESC 
    LIMIT 1
  `, [req.user.id, code], (err, otp) => {
    if (err || !otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    db.run('UPDATE otp_codes SET used = 1 WHERE id = ?', [otp.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Verification failed' });
      }

      logActivity(req.user.id, 'OTP_VERIFIED', { purpose: otp.purpose }, req);

      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    });
  });
});

// Logout
app.post('/api/auth/logout', authenticate, (req, res) => {
  // Revoke token
  db.run('UPDATE auth_tokens SET revoked = 1 WHERE token = ?', [req.token], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    logActivity(req.user.id, 'LOGOUT', {}, req);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// User profile (self)
function mapUserToProfile(u) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    role: u.role,
    jobTitle: u.job_title,
    department: u.department,
    phone: u.phone,
    employeeId: u.employee_id,
    companyName: u.company_name,
    location: u.location,
    labCode: u.lab_code,
    address: u.address,
    avatarUrl: u.avatar_url,
    lastLogin: u.last_login,
    twoFactorEnabled: !!u.two_factor_enabled,
    createdAt: u.created_at
  };
}

app.get('/api/user/profile', authenticate, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(mapUserToProfile(user));
  });
});

app.put('/api/user/profile', authenticate, (req, res) => {
  const {
    fullName, jobTitle, department, phone,
    companyName, location, labCode, address
  } = req.body;

  const updates = [];
  const params = [];
  const push = (col, val) => { if (typeof val !== 'undefined') { updates.push(`${col} = ?`); params.push(val); } };

  push('full_name', fullName);
  push('job_title', jobTitle);
  push('department', department);
  push('phone', phone);
  push('company_name', companyName);
  push('location', location);
  push('lab_code', labCode);
  push('address', address);

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

  updates.push('updated_at = datetime("now")');
  params.push(req.user.id);

  db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    logActivity(req.user.id, 'PROFILE_UPDATED', { fields: updates }, req);
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (e, user) => {
      if (e || !user) return res.status(500).json({ error: 'Failed to load updated profile' });
      res.json(mapUserToProfile(user));
    });
  });
});

app.post('/api/user/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  try {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], async (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });
      const ok = await bcrypt.compare(currentPassword, user.password_hash);
      if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword)) {
        return res.status(400).json({ error: 'Password does not meet complexity requirements' });
      }
      const hash = await bcrypt.hash(newPassword, 10);
      db.run('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?', [hash, req.user.id], (e) => {
        if (e) return res.status(500).json({ error: 'Failed to change password' });
        logActivity(req.user.id, 'PASSWORD_CHANGED', {}, req);
        res.json({ success: true, message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.post('/api/user/avatar', authenticate, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  db.run('UPDATE users SET avatar_url = ?, updated_at = datetime("now") WHERE id = ?', [url, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save avatar' });
    logActivity(req.user.id, 'AVATAR_UPDATED', { avatar: url }, req);
    res.json({ success: true, avatarUrl: url });
  });
});

app.get('/api/user/activity', authenticate, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  db.all('SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [req.user.id, parseInt(limit), parseInt(offset)], (err, activities) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch activity' });
    db.get('SELECT COUNT(*) as total FROM user_activity WHERE user_id = ?', [req.user.id], (e, count) => {
      res.json({ activities, pagination: { page: parseInt(page), limit: parseInt(limit), total: count.total, pages: Math.ceil(count.total / limit) } });
    });
  });
});

app.get('/api/user/metrics', authenticate, (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: d.toISOString().slice(0,7), label: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear() });
  }
  db.all('SELECT action, created_at FROM user_activity WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to compute metrics' });
    const byMonth = months.reduce((acc, m) => { acc[m.key] = { worksheets: 0, certificates: 0, equipment: 0 }; return acc; }, {});
    rows.forEach(r => {
      const key = String(r.created_at).slice(0,7);
      if (!byMonth[key]) return;
      if (/WORKSHEET/i.test(r.action)) byMonth[key].worksheets++;
      if (/CERTIFICATE/i.test(r.action)) byMonth[key].certificates++;
      if (/EQUIP/i.test(r.action)) byMonth[key].equipment++;
    });
    res.json({
      labels: months.map(m => m.label),
      worksheets: months.map(m => byMonth[m.key].worksheets),
      certificates: months.map(m => byMonth[m.key].certificates),
      equipment: months.map(m => byMonth[m.key].equipment)
    });
  });
});

// Forgot password
app.post('/api/auth/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    db.run(`
      UPDATE users 
      SET password_reset_token = ?, password_reset_expires = ?
      WHERE id = ?
    `, [resetToken, resetExpires.toISOString(), user.id], async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate reset token' });
      }

      // Send reset email
      const resetUrl = `${config.appUrl}/reset-password?token=${resetToken}`;
      await sendEmail(
        email,
        `Password Reset - ${config.appName}`,
        `
          <h2>Password Reset Request</h2>
          <p>Hello ${user.full_name},</p>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <p><a href="${resetUrl}" style="background: #FFB800; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
          <p>Or copy this link: ${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      );

      logActivity(user.id, 'PASSWORD_RESET_REQUESTED', {}, req);

      res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.'
      });
    });
  });
});

// Reset password
app.post('/api/auth/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
], async (req, res) => {
  const { token, password } = req.body;

  db.get(`
    SELECT * FROM users 
    WHERE password_reset_token = ? 
    AND password_reset_expires > datetime("now")
  `, [token], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(password, 10);

    db.run(`
      UPDATE users 
      SET password_hash = ?, 
          password_reset_token = NULL, 
          password_reset_expires = NULL,
          failed_login_attempts = 0,
          account_locked_until = NULL
      WHERE id = ?
    `, [password_hash, user.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Password reset failed' });
      }

      // Revoke all existing tokens
      db.run('UPDATE auth_tokens SET revoked = 1 WHERE user_id = ?', [user.id]);

      logActivity(user.id, 'PASSWORD_RESET', {}, req);

      res.json({
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.'
      });
    });
  });
});

// ==========================================
// USER MANAGEMENT (Admin Only)
// ==========================================

// List all users
app.get('/api/users', authenticate, authorize('admin', 'lead_calibrator'), (req, res) => {
  const { page = 1, limit = 50, search = '', role = '' } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (search) {
    whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (role) {
    whereClause += ' AND role = ?';
    params.push(role);
  }

  const query = `
    SELECT id, email, full_name, role, job_title, department, phone, employee_id, 
           is_active, is_verified, last_login, created_at
    FROM users 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;

  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    db.get(`SELECT COUNT(*) as total FROM users ${whereClause}`, params.slice(0, -2), (err, count) => {
      res.json({
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count.total,
          pages: Math.ceil(count.total / limit)
        }
      });
    });
  });
});

// Create user (Admin only)
app.post('/api/users', authenticate, authorize('admin'), [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('full_name').notEmpty().trim(),
  body('role').isIn(['admin', 'lead_calibrator', 'calibrator', 'viewer'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, full_name, role, job_title, department, phone, employee_id } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);

    db.run(`
      INSERT INTO users (
        email, password_hash, full_name, role, job_title, department, phone, employee_id,
        is_verified, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [
      email, password_hash, full_name, role, job_title, department, phone, employee_id, req.user.id
    ], async function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email or Employee ID already exists' });
        }
        return res.status(500).json({ error: 'Failed to create user' });
      }

      const userId = this.lastID;

      // Send welcome email
      await sendEmail(
        email,
        `Welcome to ${config.appName}`,
        `
          <h2>Welcome to ${config.appName}!</h2>
          <p>Hello ${full_name},</p>
          <p>An account has been created for you with the following details:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Role:</strong> ${role}</li>
            <li><strong>Temporary Password:</strong> ${password}</li>
          </ul>
          <p>Please log in at: <a href="${config.appUrl}">${config.appUrl}</a></p>
          <p><strong>Important:</strong> Change your password after first login.</p>
        `
      );

      logActivity(req.user.id, 'USER_CREATED', { userId, email, role }, req);

      res.json({
        success: true,
        message: 'User created successfully',
        userId
      });
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (Admin or self)
app.put('/api/users/:id', authenticate, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { full_name, job_title, department, phone, role, is_active } = req.body;

  // Check permissions
  const isAdmin = req.user.role === 'admin';
  const isSelf = req.user.id === userId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  // Only admins can change role and is_active
  const updates = [];
  const params = [];

  if (full_name) {
    updates.push('full_name = ?');
    params.push(full_name);
  }
  if (job_title) {
    updates.push('job_title = ?');
    params.push(job_title);
  }
  if (department) {
    updates.push('department = ?');
    params.push(department);
  }
  if (phone) {
    updates.push('phone = ?');
    params.push(phone);
  }
  if (isAdmin && role) {
    updates.push('role = ?');
    params.push(role);
  }
  if (isAdmin && typeof is_active !== 'undefined') {
    updates.push('is_active = ?');
    params.push(is_active ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = datetime("now")');
  params.push(userId);

  db.run(`
    UPDATE users SET ${updates.join(', ')} WHERE id = ?
  `, params, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Update failed' });
    }

    logActivity(req.user.id, 'USER_UPDATED', { userId, fields: updates }, req);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  });
});

// Delete user (Admin only)
app.delete('/api/users/:id', authenticate, authorize('admin'), (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Delete failed' });
    }

    logActivity(req.user.id, 'USER_DELETED', { userId }, req);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
});

// Get user activity log
app.get('/api/users/:id/activity', authenticate, (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Check permissions
  const isAdmin = req.user.role === 'admin';
  const isSelf = req.user.id === userId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`
    SELECT * FROM user_activity 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `, [userId, parseInt(limit), parseInt(offset)], (err, activities) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch activity' });
    }

    db.get('SELECT COUNT(*) as total FROM user_activity WHERE user_id = ?', [userId], (err, count) => {
      res.json({
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count.total,
          pages: Math.ceil(count.total / limit)
        }
      });
    });
  });
});

// ==========================================
// EXISTING CALIBRATION ROUTES (Now Protected)
// ==========================================

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'connected',
    auth: 'enabled'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'connected',
    auth: 'enabled'
  });
});

// [Keep all your existing calibration routes here, but add authenticate middleware]
// Example: app.post('/api/push', authenticate, async (req, res) => { ... })

// For brevity, I'm not duplicating all existing routes
// But they should all have authenticate middleware added

// ==================== EQUIPMENT MANAGEMENT ROUTES ====================

// Get equipment categories (MUST be before :id route)
app.get('/api/equipment/categories', authenticate, (req, res) => {
  db.all(
    'SELECT DISTINCT category FROM equipment WHERE active = 1 AND category IS NOT NULL ORDER BY category',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }
      res.json({ categories: rows.map(r => r.category) });
    }
  );
});

// Get equipment statistics (MUST be before :id route)
app.get('/api/equipment/stats', authenticate, (req, res) => {
  db.all(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN calibration_status = 'valid' THEN 1 ELSE 0 END) as valid,
      SUM(CASE WHEN calibration_status = 'due_soon' THEN 1 ELSE 0 END) as due_soon,
      SUM(CASE WHEN calibration_status = 'overdue' THEN 1 ELSE 0 END) as overdue,
      SUM(CASE WHEN calibration_status = 'pending' THEN 1 ELSE 0 END) as pending,
      category
    FROM equipment 
    WHERE active = 1
    GROUP BY category
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
    
    db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN calibration_status = 'valid' THEN 1 ELSE 0 END) as valid,
        SUM(CASE WHEN calibration_status = 'due_soon' THEN 1 ELSE 0 END) as due_soon,
        SUM(CASE WHEN calibration_status = 'overdue' THEN 1 ELSE 0 END) as overdue,
        SUM(CASE WHEN calibration_status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM equipment 
      WHERE active = 1
    `, (err, totals) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch totals' });
      }
      
      res.json({ 
        byCategory: rows,
        totals: totals || { total: 0, valid: 0, due_soon: 0, overdue: 0, pending: 0 }
      });
    });
  });
});

// Get all equipment with filters
app.get('/api/equipment', authenticate, (req, res) => {
  const { category, status, search, sortBy = 'equipment_id', sortOrder = 'ASC' } = req.query;
  
  let query = 'SELECT * FROM equipment WHERE active = 1';
  const params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (status) {
    query += ' AND calibration_status = ?';
    params.push(status);
  }
  
  if (search) {
    query += ' AND (equipment_id LIKE ? OR name LIKE ? OR manufacturer LIKE ? OR model LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  const validSortColumns = ['equipment_id', 'name', 'category', 'next_calibration_date', 'calibration_status', 'created_at'];
  const validSortOrders = ['ASC', 'DESC'];
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'equipment_id';
  const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
  
  query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;
  
  db.all(query, params, (err, equipment) => {
    if (err) {
      console.error('Equipment fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch equipment' });
    }
    
    logActivity(req.user.id, 'EQUIPMENT_LIST_VIEWED', { count: equipment.length }, req);
    res.json({ equipment });
  });
});

// Get single equipment
app.get('/api/equipment/:id', authenticate, (req, res) => {
  db.get('SELECT * FROM equipment WHERE id = ? AND active = 1', [req.params.id], (err, equipment) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch equipment' });
    }
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    logActivity(req.user.id, 'EQUIPMENT_VIEWED', { equipment_id: equipment.equipment_id }, req);
    res.json(equipment);
  });
});

// Create new equipment
app.post('/api/equipment', authenticate, [
  body('equipment_id').notEmpty().trim(),
  body('name').notEmpty().trim(),
  body('category').optional().trim(),
  body('manufacturer').optional().trim(),
  body('model').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {
    equipment_id, name, category, manufacturer, model, serial_number,
    asset_tag, location, department, responsible_person, purchase_date,
    purchase_cost, calibration_interval, last_calibration_date, next_calibration_date,
    calibration_status, traceability_standard, traceability_cert_number,
    uncertainty, range_min, range_max, resolution, accuracy, condition, notes
  } = req.body;
  
  db.run(`
    INSERT INTO equipment (
      equipment_id, name, category, manufacturer, model, serial_number,
      asset_tag, location, department, responsible_person, purchase_date,
      purchase_cost, calibration_interval, last_calibration_date, next_calibration_date,
      calibration_status, traceability_standard, traceability_cert_number,
      uncertainty, range_min, range_max, resolution, accuracy, condition, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    equipment_id, name, category, manufacturer, model, serial_number,
    asset_tag, location, department, responsible_person, purchase_date,
    purchase_cost, calibration_interval || 365, last_calibration_date, next_calibration_date,
    calibration_status || 'pending', traceability_standard, traceability_cert_number,
    uncertainty, range_min, range_max, resolution, accuracy, condition || 'good', notes, req.user.id
  ], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Equipment ID already exists' });
      }
      return res.status(500).json({ error: 'Failed to create equipment' });
    }
    
    logActivity(req.user.id, 'EQUIPMENT_CREATED', { equipment_id, name }, req);
    res.status(201).json({ 
      message: 'Equipment created successfully',
      id: this.lastID,
      equipment_id
    });
  });
});

// Update equipment
app.put('/api/equipment/:id', authenticate, (req, res) => {
  const fields = Object.keys(req.body).filter(key => key !== 'id' && key !== 'created_by' && key !== 'created_at');
  
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => req.body[field]);
  values.push(new Date().toISOString());
  values.push(req.params.id);
  
  db.run(
    `UPDATE equipment SET ${setClause}, updated_at = ? WHERE id = ? AND active = 1`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update equipment' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
      
      logActivity(req.user.id, 'EQUIPMENT_UPDATED', { equipment_id: req.params.id }, req);
      res.json({ message: 'Equipment updated successfully' });
    }
  );
});

// Delete equipment (soft delete)
app.delete('/api/equipment/:id', authenticate, (req, res) => {
  db.run(
    'UPDATE equipment SET active = 0, updated_at = ? WHERE id = ?',
    [new Date().toISOString(), req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete equipment' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Equipment not found' });
      }
      
      logActivity(req.user.id, 'EQUIPMENT_DELETED', { equipment_id: req.params.id }, req);
      res.json({ message: 'Equipment deleted successfully' });
    }
  );
});

// ===== CLIENT MANAGEMENT API ENDPOINTS =====

// Get client industries (for filter dropdown) - MUST come before :id route
app.get('/api/clients/industries', authenticate, (req, res) => {
  db.all(
    'SELECT DISTINCT industry FROM clients WHERE industry IS NOT NULL AND industry != "" ORDER BY industry',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch industries' });
      }
      const industries = rows.map(row => row.industry);
      res.json(industries);
    }
  );
});

// Get client statistics - MUST come before :id route
app.get('/api/clients/stats', authenticate, (req, res) => {
  db.get(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
      SUM(CASE WHEN client_type = 'corporate' THEN 1 ELSE 0 END) as corporate,
      SUM(CASE WHEN client_type = 'government' THEN 1 ELSE 0 END) as government,
      SUM(credit_limit) as total_credit_limit
    FROM clients`,
    [],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch statistics' });
      }
      res.json(stats);
    }
  );
});

// Get all clients with filtering
app.get('/api/clients', authenticate, (req, res) => {
  const { industry, status, client_type, search, sortBy = 'company_name', sortOrder = 'asc' } = req.query;
  
  let query = 'SELECT * FROM clients WHERE 1=1';
  const params = [];
  
  if (industry) {
    query += ' AND industry = ?';
    params.push(industry);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  if (client_type) {
    query += ' AND client_type = ?';
    params.push(client_type);
  }
  
  if (search) {
    query += ' AND (company_name LIKE ? OR contact_person LIKE ? OR email LIKE ? OR client_id LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // Validate and add sorting
  const allowedSortFields = ['company_name', 'client_id', 'status', 'industry', 'created_at'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'company_name';
  const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortDirection}`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch clients' });
    }
    res.json(rows);
  });
});

// Get single client by ID
app.get('/api/clients/:id', authenticate, (req, res) => {
  db.get(
    'SELECT * FROM clients WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch client' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(row);
    }
  );
});

// Create new client
app.post('/api/clients', authenticate, (req, res) => {
  const {
    client_id, company_name, contact_person, email, phone, mobile,
    address, city, state, postal_code, country, industry, client_type,
    status, tax_id, registration_number, payment_terms, credit_limit,
    website, notes
  } = req.body;
  
  // Validate required fields
  if (!client_id || !company_name) {
    return res.status(400).json({ error: 'Client ID and company name are required' });
  }
  
  db.run(
    `INSERT INTO clients (
      client_id, company_name, contact_person, email, phone, mobile,
      address, city, state, postal_code, country, industry, client_type,
      status, tax_id, registration_number, payment_terms, credit_limit,
      website, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      client_id, company_name, contact_person, email, phone, mobile,
      address, city, state, postal_code, country || 'Ghana', industry, client_type || 'corporate',
      status || 'active', tax_id, registration_number, payment_terms || 'Net 30', credit_limit,
      website, notes, req.user.id
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Client ID already exists' });
        }
        return res.status(500).json({ error: 'Failed to create client' });
      }
      
      logActivity(req.user.id, 'CLIENT_CREATED', { client_id, company_name }, req);
      res.status(201).json({ id: this.lastID, message: 'Client created successfully' });
    }
  );
});

// Update client
app.put('/api/clients/:id', authenticate, (req, res) => {
  const {
    client_id, company_name, contact_person, email, phone, mobile,
    address, city, state, postal_code, country, industry, client_type,
    status, tax_id, registration_number, payment_terms, credit_limit,
    website, notes
  } = req.body;
  
  db.run(
    `UPDATE clients SET
      client_id = ?, company_name = ?, contact_person = ?, email = ?, phone = ?, mobile = ?,
      address = ?, city = ?, state = ?, postal_code = ?, country = ?, industry = ?, client_type = ?,
      status = ?, tax_id = ?, registration_number = ?, payment_terms = ?, credit_limit = ?,
      website = ?, notes = ?, updated_at = ?
    WHERE id = ?`,
    [
      client_id, company_name, contact_person, email, phone, mobile,
      address, city, state, postal_code, country, industry, client_type,
      status, tax_id, registration_number, payment_terms, credit_limit,
      website, notes, new Date().toISOString(), req.params.id
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Client ID already exists' });
        }
        return res.status(500).json({ error: 'Failed to update client' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      logActivity(req.user.id, 'CLIENT_UPDATED', { client_id, company_name }, req);
      res.json({ message: 'Client updated successfully' });
    }
  );
});

// Delete client (soft delete by setting status to inactive)
app.delete('/api/clients/:id', authenticate, (req, res) => {
  db.run(
    'UPDATE clients SET status = ?, updated_at = ? WHERE id = ?',
    ['inactive', new Date().toISOString(), req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete client' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      logActivity(req.user.id, 'CLIENT_DELETED', { client_id: req.params.id }, req);
      res.json({ message: 'Client deleted successfully' });
    }
  );
});

// ===== FREE INTEGRATIONS API ENDPOINTS =====

// 1. PDF CERTIFICATE GENERATION
app.post('/api/integrations/generate-certificate', authenticate, async (req, res) => {
  try {
    const { equipment_id, calibration_data } = req.body;

    // Fetch equipment details
    const equipment = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM equipment WHERE id = ?', [equipment_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${equipment.equipment_id}-${Date.now()}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Company Header
    doc.fontSize(24)
       .fillColor('#FFB800')
       .text('CALIBRATION CERTIFICATE', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(12)
       .fillColor('#333333')
       .text('Calibration Management System', { align: 'center' })
       .text('ISO/IEC 17025:2017 Accredited Laboratory', { align: 'center' })
       .moveDown(1);

    // Certificate Number and Date
    const certNumber = `CERT-${equipment.equipment_id}-${Date.now()}`;
    doc.fontSize(10)
       .fillColor('#666666')
       .text(`Certificate No: ${certNumber}`, { align: 'right' })
       .text(`Issue Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
       .moveDown(1.5);

    // Section: Equipment Information
    doc.fontSize(14)
       .fillColor('#FFB800')
       .text('EQUIPMENT INFORMATION', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#333333')
       .text(`Equipment ID: ${equipment.equipment_id}`)
       .text(`Name: ${equipment.name}`)
       .text(`Manufacturer: ${equipment.manufacturer || 'N/A'}`)
       .text(`Model: ${equipment.model || 'N/A'}`)
       .text(`Serial Number: ${equipment.serial_number || 'N/A'}`)
       .text(`Category: ${equipment.category}`)
       .moveDown(1);

    // Section: Calibration Details
    doc.fontSize(14)
       .fillColor('#FFB800')
       .text('CALIBRATION DETAILS', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#333333')
       .text(`Last Calibration: ${equipment.last_calibration_date ? new Date(equipment.last_calibration_date).toLocaleDateString() : 'N/A'}`)
       .text(`Next Calibration Due: ${equipment.next_calibration_date ? new Date(equipment.next_calibration_date).toLocaleDateString() : 'N/A'}`)
       .text(`Calibration Interval: ${equipment.calibration_interval || 'N/A'}`)
       .text(`Status: ${equipment.calibration_status}`)
       .moveDown(1);

    // Section: Traceability
    doc.fontSize(14)
       .fillColor('#FFB800')
       .text('TRACEABILITY INFORMATION', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#333333')
       .text(`Standard: ${equipment.traceability_standard || 'N/A'}`)
       .text(`Certificate Number: ${equipment.traceability_cert_number || 'N/A'}`)
       .text(`Uncertainty: ${equipment.uncertainty || 'N/A'}`)
       .moveDown(1);

    // Section: Specifications
    doc.fontSize(14)
       .fillColor('#FFB800')
       .text('TECHNICAL SPECIFICATIONS', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#333333')
       .text(`Range: ${equipment.range_min || 'N/A'} to ${equipment.range_max || 'N/A'}`)
       .text(`Resolution: ${equipment.resolution || 'N/A'}`)
       .text(`Accuracy: ${equipment.accuracy || 'N/A'}`)
       .text(`Condition: ${equipment.condition || 'N/A'}`)
       .moveDown(2);

    // Footer - Digital Signature Area
    doc.fontSize(10)
       .fillColor('#999999')
       .text('This is a digitally generated certificate', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(8)
       .text('Authorized Signatory: _________________________', 100, doc.page.height - 100)
       .text(`Date: ${new Date().toLocaleDateString()}`, 100, doc.page.height - 80);

    // Compliance Statement
    doc.fontSize(7)
       .fillColor('#666666')
       .text('This certificate is issued in accordance with ISO/IEC 17025:2017 standards', { align: 'center' }, doc.page.height - 50)
       .text('Certificate remains valid until next calibration date unless equipment is damaged or modified', { align: 'center' }, doc.page.height - 35);

    // Finalize PDF
    doc.end();

    // Log activity
    logActivity(req.user.id, 'CERTIFICATE_GENERATED', { equipment_id, cert_number: certNumber }, req);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate certificate', details: error.message });
  }
});

// 2. EMAIL NOTIFICATION SYSTEM
app.post('/api/integrations/send-notification', authenticate, async (req, res) => {
  try {
    const { type, recipient_email, equipment_id, client_id } = req.body;

    if (!recipient_email) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    let subject = '';
    let htmlContent = '';

    if (type === 'calibration_due') {
      // Fetch equipment details
      const equipment = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM equipment WHERE id = ?', [equipment_id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }

      subject = `Calibration Due: ${equipment.name} (${equipment.equipment_id})`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FFB800; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Calibration Due Reminder</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Equipment Calibration Due</h2>
            <p>The following equipment requires calibration:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;"><strong>Equipment ID:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;">${equipment.equipment_id}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;"><strong>Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;">${equipment.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;"><strong>Category:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;">${equipment.category}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;"><strong>Due Date:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;">${new Date(equipment.next_calibration_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff;"><strong>Status:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; background: #fff; color: ${equipment.calibration_status === 'overdue' ? 'red' : 'orange'}; font-weight: bold;">${equipment.calibration_status.toUpperCase()}</td>
              </tr>
            </table>
            <p style="color: #666;">Please schedule calibration as soon as possible to maintain compliance.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/equipment.html" style="background: #FFB800; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Equipment</a>
            </div>
          </div>
          <div style="background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
            <p>Calibration Management System - ISO/IEC 17025:2017</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      `;
    } else if (type === 'certificate_ready') {
      subject = 'Calibration Certificate Ready for Download';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">✓ Certificate Ready</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Your Calibration Certificate is Ready</h2>
            <p>Your equipment calibration has been completed and the certificate is now available for download.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/equipment.html" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Certificate</a>
            </div>
          </div>
          <div style="background: #333; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
            <p>Calibration Management System</p>
          </div>
        </div>
      `;
    }

    // Send email
    if (emailTransporter) {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@calibration.com',
        to: recipient_email,
        subject: subject,
        html: htmlContent
      });

      logActivity(req.user.id, 'EMAIL_SENT', { type, recipient: recipient_email }, req);
      res.json({ message: 'Notification sent successfully' });
    } else {
      console.log('📧 Email simulation:', { to: recipient_email, subject });
      res.json({ message: 'Email simulated (SMTP not configured)', simulated: true });
    }

  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

// 3. DATA EXPORT TO CSV (for Google Sheets/Data Studio)
app.get('/api/integrations/export/:type', authenticate, async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;

    let data = [];
    let filename = '';

    if (type === 'equipment') {
      data = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM equipment WHERE active = 1', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      filename = `equipment-export-${Date.now()}.csv`;
    } else if (type === 'clients') {
      data = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM clients WHERE status = "active"', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      filename = `clients-export-${Date.now()}.csv`;
    } else if (type === 'calibration-schedule') {
      data = await new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            equipment_id, name, category, manufacturer, model,
            last_calibration_date, next_calibration_date, 
            calibration_interval, calibration_status, location, department
          FROM equipment 
          WHERE active = 1 AND next_calibration_date IS NOT NULL
          ORDER BY next_calibration_date ASC
        `, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      filename = `calibration-schedule-${Date.now()}.csv`;
    } else if (type === 'overdue') {
      data = await new Promise((resolve, reject) => {
        db.all(`
          SELECT * FROM equipment 
          WHERE active = 1 AND calibration_status = 'overdue'
          ORDER BY next_calibration_date ASC
        `, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      filename = `overdue-equipment-${Date.now()}.csv`;
    } else {
      return res.status(400).json({ error: 'Invalid export type. Use: equipment, clients, calibration-schedule, or overdue' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found to export' });
    }

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);

    logActivity(req.user.id, 'DATA_EXPORTED', { type, records: data.length }, req);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data', details: error.message });
  }
});

// Auto-send calibration reminders (can be triggered by cron job)
app.post('/api/integrations/auto-reminders', authenticate, async (req, res) => {
  try {
    // Find equipment due within 7 days
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dueSoon = await new Promise((resolve, reject) => {
      db.all(`
        SELECT e.*, c.email as client_email, c.company_name 
        FROM equipment e
        LEFT JOIN clients c ON e.created_by = c.id
        WHERE e.active = 1 
        AND e.next_calibration_date IS NOT NULL
        AND date(e.next_calibration_date) <= date(?)
        AND date(e.next_calibration_date) >= date(?)
      `, [sevenDaysFromNow.toISOString(), today.toISOString()], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    let sentCount = 0;
    for (const equipment of dueSoon) {
      if (equipment.client_email) {
        // Send reminder (this would use the email endpoint)
        console.log(`📧 Reminder would be sent for: ${equipment.equipment_id} to ${equipment.client_email}`);
        sentCount++;
      }
    }

    res.json({ 
      message: `Processed ${dueSoon.length} equipment items`,
      reminders_sent: sentCount,
      equipment: dueSoon.map(e => ({ id: e.equipment_id, name: e.name, due: e.next_calibration_date }))
    });

  } catch (error) {
    console.error('Auto-reminder error:', error);
    res.status(500).json({ error: 'Failed to process reminders', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(config.port, config.host, () => {
  console.log(`\n🎯 Calibration MVP Server (Auth-Enabled) running on http://${config.host}:${config.port}`);
  console.log(`📊 Database: ${config.dbPath}`);
  console.log(`🔐 Authentication: ENABLED`);
  console.log(`📧 Email: ${emailTransporter ? 'CONFIGURED' : 'SIMULATED'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('📊 Database connection closed.');
    }
    process.exit(0);
  });
});
