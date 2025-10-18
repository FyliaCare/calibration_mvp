/**
 * Database Schema Initialization
 * Creates all required tables for the calibration management system
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function initializeDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Equipment Table
      db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          serial_number TEXT UNIQUE NOT NULL,
          model TEXT,
          manufacturer TEXT,
          category TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          location TEXT,
          purchase_date DATE,
          last_calibration_date DATE,
          next_calibration_date DATE,
          calibration_interval INTEGER DEFAULT 12,
          specifications TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating equipment table:', err);
        else console.log('✅ Equipment table ready');
      });

      // Clients Table
      db.run(`
        CREATE TABLE IF NOT EXISTS clients (
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
          account_type TEXT DEFAULT 'standard',
          status TEXT DEFAULT 'active',
          total_revenue REAL DEFAULT 0,
          total_jobs INTEGER DEFAULT 0,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating clients table:', err);
        else console.log('✅ Clients table ready');
      });

      // Client Contacts Table
      db.run(`
        CREATE TABLE IF NOT EXISTS client_contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          role TEXT,
          is_primary INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating client_contacts table:', err);
        else console.log('✅ Client contacts table ready');
      });

      // Client Equipment Assignments
      db.run(`
        CREATE TABLE IF NOT EXISTS client_equipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          equipment_id INTEGER NOT NULL,
          assigned_date DATE DEFAULT CURRENT_DATE,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
          FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
          UNIQUE(client_id, equipment_id)
        )
      `, (err) => {
        if (err) console.error('Error creating client_equipment table:', err);
        else console.log('✅ Client equipment table ready');
      });

      // Calibrations Table
      db.run(`
        CREATE TABLE IF NOT EXISTS calibrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          certificate_number TEXT UNIQUE NOT NULL,
          equipment_id INTEGER NOT NULL,
          equipment_name TEXT,
          equipment_serial TEXT,
          equipment_category TEXT,
          client_id INTEGER NOT NULL,
          client_name TEXT,
          calibration_date DATE NOT NULL,
          next_due_date DATE NOT NULL,
          technician_id INTEGER,
          technician_name TEXT,
          status TEXT DEFAULT 'pending',
          result TEXT DEFAULT 'pending',
          location TEXT DEFAULT 'in-lab',
          temperature REAL,
          humidity REAL,
          standard_name TEXT,
          standard_serial TEXT,
          standard_certificate TEXT,
          standard_expiry DATE,
          as_found TEXT,
          as_found_notes TEXT,
          as_left TEXT,
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
          FOREIGN KEY (client_id) REFERENCES clients(id)
        )
      `, (err) => {
        if (err) console.error('Error creating calibrations table:', err);
        else console.log('✅ Calibrations table ready');
      });

      // Users Table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'technician',
          department TEXT,
          status TEXT DEFAULT 'active',
          phone TEXT,
          avatar TEXT,
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('✅ Users table ready');
      });

      // Settings Table
      db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          category TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_by INTEGER,
          FOREIGN KEY (updated_by) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creating settings table:', err);
        else console.log('✅ Settings table ready');
      });

      // Audit Log Table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          user_name TEXT,
          action TEXT NOT NULL,
          entity_type TEXT,
          entity_id INTEGER,
          details TEXT,
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creating audit_log table:', err);
        else console.log('✅ Audit log table ready');
      });

      // Attachments Table
      db.run(`
        CREATE TABLE IF NOT EXISTS attachments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entity_type TEXT NOT NULL,
          entity_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_size INTEGER,
          mime_type TEXT,
          file_path TEXT NOT NULL,
          uploaded_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploaded_by) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creating attachments table:', err);
        else console.log('✅ Attachments table ready');
      });

      // Create indexes for better performance
      db.run('CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category)');
      db.run('CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_calibrations_status ON calibrations(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_calibrations_equipment ON calibrations(equipment_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_calibrations_client ON calibrations(client_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

      console.log('✅ Database indexes created');
    });

    // Wait for all operations to complete
    db.get('SELECT 1', [], (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Database initialization complete');
        resolve(db);
      }
    });
  });
}

module.exports = { initializeDatabase };
