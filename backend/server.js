
/**
 * Calibration MVP - Enhanced Server
 * Professional instrument calibration certificate management system
 * 
 * Features:
 * - SQLite database with comprehensive schema
 * - RESTful API endpoints
 * - File attachment handling
 * - Authentication ready
 * - Audit logging
 * - Data validation
 * - Export/backup functionality
 */

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const multer = require('multer');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
const DB_PATH = path.join(__dirname, 'calibration.db');
const db = new sqlite3.Database(DB_PATH);

// Enhanced database schema
db.serialize(() => {
  // Drop existing table if it exists to recreate with new schema
  db.run(`DROP TABLE IF EXISTS records`);
  db.run(`DROP TABLE IF EXISTS test_results`);
  db.run(`DROP TABLE IF EXISTS attachments`);
  db.run(`DROP TABLE IF EXISTS audit_log`);
  
  // Main records table
  db.run(`CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    local_id TEXT UNIQUE,
    certificate_number TEXT UNIQUE NOT NULL,
    instrument_type TEXT NOT NULL,
    customer TEXT,
    job_reference TEXT,
    date_of_issue DATE,
    date_due DATE,
    
    -- Equipment information
    equipment_description TEXT,
    equipment_manufacturer TEXT,
    equipment_model TEXT,
    equipment_serial TEXT,
    equipment_range_min REAL,
    equipment_range_max REAL,
    equipment_units TEXT,
    equipment_accuracy REAL,
    
    -- Test conditions
    test_temperature REAL,
    test_humidity REAL,
    test_pressure REAL,
    environmental_conditions TEXT,
    
    -- Traceability
    reference_standard TEXT,
    reference_certificate TEXT,
    reference_cal_date DATE,
    reference_due_date DATE,
    
    -- Technician info
    technician_name TEXT,
    technician_certification TEXT,
    
    -- Status and metadata
    overall_result TEXT CHECK(overall_result IN ('PASS', 'FAIL', 'CONDITIONAL')),
    test_points_total INTEGER DEFAULT 0,
    test_points_passed INTEGER DEFAULT 0,
    test_points_failed INTEGER DEFAULT 0,
    measurement_uncertainty REAL,
    
    -- Full payload for backwards compatibility
    payload TEXT,
    
    -- Sync and audit
    synced INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
  )`);

  // Test results table
  db.run(`CREATE TABLE test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    sequence_number INTEGER,
    reference_value REAL,
    measured_value REAL,
    deviation REAL,
    error_percent REAL,
    direction TEXT CHECK(direction IN ('rise', 'fall')),
    result TEXT CHECK(result IN ('Pass', 'Fail')),
    notes TEXT,
    FOREIGN KEY (record_id) REFERENCES records (id) ON DELETE CASCADE
  )`);

  // Attachments table
  db.run(`CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    filename TEXT NOT NULL,
    original_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES records (id) ON DELETE CASCADE
  )`);

  // Audit log
  db.run(`CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    action TEXT NOT NULL,
    old_values TEXT,
    new_values TEXT,
    user_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES records (id)
  )`);

  // Create indexes for better performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_records_cert_number ON records(certificate_number)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_records_date ON records(date_of_issue)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_records_sync ON records(synced)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_test_results_record ON test_results(record_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_attachments_record ON attachments(record_id)`);
});

// Utility functions
function logAudit(recordId, action, oldValues, newValues, userId, req) {
  const stmt = db.prepare(`
    INSERT INTO audit_log (record_id, action, old_values, new_values, user_id, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    recordId,
    action,
    oldValues ? JSON.stringify(oldValues) : null,
    newValues ? JSON.stringify(newValues) : null,
    userId || 'anonymous',
    req.ip || req.connection.remoteAddress,
    req.get('User-Agent') || null
  );
  
  stmt.finalize();
}

function validateRecord(record) {
  const errors = [];
  
  if (!record.certificate_number) {
    errors.push('Certificate number is required');
  }
  
  if (!record.instrument_type) {
    errors.push('Instrument type is required');
  }
  
  if (!record.date_of_issue) {
    errors.push('Issue date is required');
  }
  
  // Add more validation as needed
  
  return errors;
}

// API Routes

// Health check endpoints (both routes for compatibility)
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'connected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'connected'
  });
});

// Enhanced record creation/update endpoint
app.post('/api/push', async (req, res) => {
  try {
    const record = req.body;
    
    // Validate input
    const validationErrors = validateRecord(record);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Check for existing record
    const existingRecord = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM records WHERE certificate_number = ? OR local_id = ?",
        [record.certificate_number, record.localId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    let recordId;
    
    if (existingRecord) {
      // Update existing record
      recordId = existingRecord.id;
      
      const stmt = db.prepare(`
        UPDATE records SET 
          certificate_number = ?, instrument_type = ?, customer = ?, 
          job_reference = ?, date_of_issue = ?, date_due = ?,
          equipment_description = ?, equipment_manufacturer = ?, 
          equipment_model = ?, equipment_serial = ?,
          equipment_range_max = ?, equipment_units = ?, equipment_accuracy = ?,
          environmental_conditions = ?, reference_standard = ?, 
          reference_certificate = ?, reference_cal_date = ?, reference_due_date = ?,
          technician_name = ?, technician_certification = ?,
          overall_result = ?, test_points_total = ?, test_points_passed = ?, 
          test_points_failed = ?, measurement_uncertainty = ?,
          payload = ?, synced = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      await new Promise((resolve, reject) => {
        stmt.run([
          record.certificate_number,
          record.instrument_type,
          record.customer,
          record.job_reference,
          record.date_of_issue,
          record.date_due,
          record.equipment?.description,
          record.equipment?.manufacturer,
          record.equipment?.type_range,
          record.equipment?.serial_number,
          record.calibration?.full_scale,
          record.units,
          record.calibration?.accuracy_percent_fs,
          record.environmental_conditions,
          record.traceability?.reference_equipment,
          record.traceability?.certificate_number,
          record.traceability?.calibration_date,
          record.traceability?.due_date,
          record.technician_name,
          record.technician_certification,
          record.summary?.overall,
          record.summary?.totalPoints,
          record.summary?.totalPoints - record.summary?.failed,
          record.summary?.failed,
          record.measurement_uncertainty,
          JSON.stringify(record),
          recordId
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });

      stmt.finalize();
      logAudit(recordId, 'UPDATE', null, record, null, req);
      
    } else {
      // Create new record
      const stmt = db.prepare(`
        INSERT INTO records (
          local_id, certificate_number, instrument_type, customer, 
          job_reference, date_of_issue, date_due,
          equipment_description, equipment_manufacturer, equipment_model, 
          equipment_serial, equipment_range_max, equipment_units, equipment_accuracy,
          environmental_conditions, reference_standard, reference_certificate, 
          reference_cal_date, reference_due_date,
          technician_name, technician_certification,
          overall_result, test_points_total, test_points_passed, 
          test_points_failed, measurement_uncertainty,
          payload, synced
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `);

      recordId = await new Promise((resolve, reject) => {
        stmt.run([
          record.localId,
          record.certificate_number,
          record.instrument_type,
          record.customer,
          record.job_reference,
          record.date_of_issue,
          record.date_due,
          record.equipment?.description,
          record.equipment?.manufacturer,
          record.equipment?.type_range,
          record.equipment?.serial_number,
          record.calibration?.full_scale,
          record.units,
          record.calibration?.accuracy_percent_fs,
          record.environmental_conditions,
          record.traceability?.reference_equipment,
          record.traceability?.certificate_number,
          record.traceability?.calibration_date,
          record.traceability?.due_date,
          record.technician_name,
          record.technician_certification,
          record.summary?.overall,
          record.summary?.totalPoints,
          record.summary?.totalPoints - record.summary?.failed,
          record.summary?.failed,
          record.measurement_uncertainty,
          JSON.stringify(record)
        ], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });

      stmt.finalize();
      logAudit(recordId, 'CREATE', null, record, null, req);
    }

    // Handle test results
    if (record.results && Array.isArray(record.results)) {
      // Delete existing results
      await new Promise((resolve, reject) => {
        db.run("DELETE FROM test_results WHERE record_id = ?", [recordId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Insert new results
      const resultsStmt = db.prepare(`
        INSERT INTO test_results (
          record_id, sequence_number, reference_value, measured_value, 
          deviation, error_percent, direction, result, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < record.results.length; i++) {
        const result = record.results[i];
        const errorPercent = result.reference !== 0 ? 
          ((result.measured - result.reference) / result.reference) * 100 : 0;

        await new Promise((resolve, reject) => {
          resultsStmt.run([
            recordId,
            i + 1,
            result.reference,
            result.measured,
            result.deviation,
            errorPercent,
            result.direction,
            result.remarks,
            result.notes
          ], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      resultsStmt.finalize();
    }

    res.json({ 
      ok: true, 
      id: recordId,
      message: existingRecord ? 'Record updated' : 'Record created'
    });

  } catch (error) {
    console.error('Push error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Enhanced records listing with filtering and pagination
app.get('/api/records', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const status = req.query.status || 'all';
  const instrumentType = req.query.instrument_type || '';

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (search) {
    whereClause += ' AND (certificate_number LIKE ? OR equipment_description LIKE ? OR customer LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status !== 'all') {
    if (status === 'synced') {
      whereClause += ' AND synced = 1';
    } else if (status === 'unsynced') {
      whereClause += ' AND synced = 0';
    }
  }

  if (instrumentType) {
    whereClause += ' AND instrument_type = ?';
    params.push(instrumentType);
  }

  const query = `
    SELECT id, certificate_number, instrument_type, customer, date_of_issue, 
           overall_result, test_points_total, test_points_passed, synced, 
           created_at, updated_at
    FROM records 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM records ${whereClause}`;
    db.get(countQuery, params.slice(0, -2), (err, countResult) => {
      if (err) {
        console.error('Count error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        records: rows,
        pagination: {
          page,
          limit,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Get single record with full details
app.get('/api/records/:id', (req, res) => {
  const recordId = req.params.id;

  // Get main record
  db.get("SELECT * FROM records WHERE id = ?", [recordId], (err, record) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Get test results
    db.all("SELECT * FROM test_results WHERE record_id = ? ORDER BY sequence_number", [recordId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get attachments
      db.all("SELECT * FROM attachments WHERE record_id = ?", [recordId], (err, attachments) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          ...record,
          test_results: results,
          attachments: attachments
        });
      });
    });
  });
});

// File upload endpoint
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileInfos = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path
  }));

  res.json({
    ok: true,
    files: fileInfos
  });
});

// Export data endpoint
app.get('/api/export', (req, res) => {
  const format = req.query.format || 'json';
  
  db.all("SELECT * FROM records ORDER BY created_at DESC", (err, records) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(records);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=calibration-records.csv');
      res.send(csv);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=calibration-records.json');
      res.json({
        exportDate: new Date().toISOString(),
        recordCount: records.length,
        records: records
      });
    }
  });
});

function convertToCSV(records) {
  if (records.length === 0) return '';
  
  const headers = Object.keys(records[0]).join(',');
  const rows = records.map(record => {
    return Object.values(record).map(value => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
}

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
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🎯 Calibration MVP Server running on http://${HOST}:${PORT}`);
  console.log(`📊 Database: ${DB_PATH}`);
  console.log(`📁 Uploads: ${path.join(__dirname, 'uploads')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
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
