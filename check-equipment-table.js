const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

// Check for equipment table
db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name LIKE '%equip%'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Equipment tables:', tables);
  }
  
  // List all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('\nAll tables:', rows.map(r => r.name));
    }
    db.close();
  });
});
