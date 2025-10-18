/**
 * Database Migration Script
 * Fixes column mismatches between old and new schema
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'calibration.db');
console.log('🔧 Starting database migration...');

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // Check if equipment table exists and get its columns
  db.all("PRAGMA table_info(equipment)", (err, columns) => {
    if (err) {
      console.log('❌ Error checking equipment table:', err);
      return;
    }

    if (columns.length === 0) {
      console.log('✅ Equipment table does not exist, will be created fresh');
      db.close();
      return;
    }

    console.log('📋 Current equipment table columns:', columns.map(c => c.name));
    
    const hasEquipmentId = columns.some(c => c.name === 'equipment_id');
    
    if (!hasEquipmentId) {
      console.log('🔧 Adding missing equipment_id column...');
      
      db.run("ALTER TABLE equipment ADD COLUMN equipment_id TEXT", (err) => {
        if (err && !err.message.includes('duplicate')) {
          console.log('❌ Error adding equipment_id:', err);
        } else {
          console.log('✅ Added equipment_id column');
          
          // Update existing records to have equipment_id based on id
          db.run("UPDATE equipment SET equipment_id = 'EQ-' || printf('%04d', id) WHERE equipment_id IS NULL", (err) => {
            if (err) {
              console.log('❌ Error updating equipment_id values:', err);
            } else {
              console.log('✅ Updated equipment_id values');
            }
          });
        }
      });
    } else {
      console.log('✅ equipment_id column already exists');
    }
  });

  // Check clients table
  db.all("PRAGMA table_info(clients)", (err, columns) => {
    if (err || columns.length === 0) {
      console.log('📝 Clients table will be created fresh');
    } else {
      console.log('✅ Clients table exists with columns:', columns.map(c => c.name));
    }
  });

  // Check records table
  db.all("PRAGMA table_info(records)", (err, columns) => {
    if (err || columns.length === 0) {
      console.log('📝 Records table will be created fresh');
    } else {
      console.log('✅ Records table exists with columns:', columns.map(c => c.name));
    }
  });
});

// Close after 2 seconds to allow operations to complete
setTimeout(() => {
  db.close(() => {
    console.log('🎯 Database migration completed');
    console.log('✅ Ready to start server');
  });
}, 2000);