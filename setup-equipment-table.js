const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

console.log('Creating equipment table...');

db.serialize(() => {
  // Create equipment table
  db.run(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      manufacturer TEXT,
      model TEXT,
      serial_number TEXT,
      asset_tag TEXT,
      location TEXT,
      department TEXT,
      responsible_person TEXT,
      purchase_date DATE,
      purchase_cost REAL,
      calibration_interval INTEGER DEFAULT 365,
      last_calibration_date DATE,
      next_calibration_date DATE,
      calibration_status TEXT DEFAULT 'pending',
      traceability_standard TEXT,
      traceability_cert_number TEXT,
      uncertainty TEXT,
      range_min TEXT,
      range_max TEXT,
      resolution TEXT,
      accuracy TEXT,
      condition TEXT DEFAULT 'good',
      notes TEXT,
      active INTEGER DEFAULT 1,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✓ Equipment table created');
    }
  });

  // Insert sample equipment
  const sampleEquipment = [
    {
      equipment_id: 'EQUIP-001',
      name: 'Digital Multimeter',
      category: 'Electrical',
      manufacturer: 'Fluke',
      model: '87V',
      serial_number: 'FL87V-001234',
      asset_tag: 'AST-001',
      location: 'Calibration Lab - Room 101',
      department: 'Electrical Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2023-01-15',
      purchase_cost: 1500.00,
      calibration_interval: 365,
      last_calibration_date: '2024-10-01',
      next_calibration_date: '2025-10-01',
      calibration_status: 'valid',
      traceability_standard: 'NIST Traceable Standard',
      traceability_cert_number: 'NIST-2024-0012345',
      uncertainty: '±0.05%',
      range_min: '0 V',
      range_max: '1000 V',
      resolution: '0.1 mV',
      accuracy: '±(0.05% + 2 counts)',
      condition: 'excellent',
      notes: 'Primary reference standard for electrical measurements',
      created_by: 1
    },
    {
      equipment_id: 'EQUIP-002',
      name: 'Temperature Calibrator',
      category: 'Temperature',
      manufacturer: 'Fluke',
      model: '9142',
      serial_number: 'FK9142-005678',
      asset_tag: 'AST-002',
      location: 'Calibration Lab - Room 102',
      department: 'Temperature Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2023-03-20',
      purchase_cost: 8500.00,
      calibration_interval: 365,
      last_calibration_date: '2024-09-15',
      next_calibration_date: '2025-09-15',
      calibration_status: 'valid',
      traceability_standard: 'UKAS Traceable',
      traceability_cert_number: 'UKAS-2024-T-789',
      uncertainty: '±0.25°C',
      range_min: '-25°C',
      range_max: '660°C',
      resolution: '0.01°C',
      accuracy: '±0.25°C',
      condition: 'good',
      notes: 'Used for thermocouple and RTD calibrations',
      created_by: 1
    },
    {
      equipment_id: 'EQUIP-003',
      name: 'Pressure Gauge',
      category: 'Pressure',
      manufacturer: 'Druck',
      model: 'DPI 620',
      serial_number: 'DK620-002345',
      asset_tag: 'AST-003',
      location: 'Calibration Lab - Room 101',
      department: 'Pressure Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2022-11-10',
      purchase_cost: 3200.00,
      calibration_interval: 365,
      last_calibration_date: '2024-08-20',
      next_calibration_date: '2025-08-20',
      calibration_status: 'valid',
      traceability_standard: 'NPL Traceable',
      traceability_cert_number: 'NPL-2024-P-456',
      uncertainty: '±0.025% FS',
      range_min: '0 bar',
      range_max: '700 bar',
      resolution: '0.001 bar',
      accuracy: '±0.025% of reading',
      condition: 'good',
      notes: 'Hydraulic and pneumatic pressure calibration',
      created_by: 1
    },
    {
      equipment_id: 'EQUIP-004',
      name: 'Digital Scale',
      category: 'Mass',
      manufacturer: 'Mettler Toledo',
      model: 'XPE205',
      serial_number: 'MT205-009876',
      asset_tag: 'AST-004',
      location: 'Calibration Lab - Room 103',
      department: 'Mass Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2023-06-05',
      purchase_cost: 4500.00,
      calibration_interval: 180,
      last_calibration_date: '2024-09-01',
      next_calibration_date: '2025-03-01',
      calibration_status: 'valid',
      traceability_standard: 'OIML Traceable',
      traceability_cert_number: 'OIML-2024-M-123',
      uncertainty: '±0.015 mg',
      range_min: '0 g',
      range_max: '220 g',
      resolution: '0.01 mg',
      accuracy: '±0.015 mg',
      condition: 'excellent',
      notes: 'Micro-balance for precise mass measurements',
      created_by: 1
    },
    {
      equipment_id: 'EQUIP-005',
      name: 'Oscilloscope',
      category: 'Electrical',
      manufacturer: 'Tektronix',
      model: 'MSO64',
      serial_number: 'TEK64-123456',
      asset_tag: 'AST-005',
      location: 'Calibration Lab - Room 101',
      department: 'Electrical Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2024-02-15',
      purchase_cost: 12000.00,
      calibration_interval: 365,
      last_calibration_date: '2024-02-20',
      next_calibration_date: '2025-02-20',
      calibration_status: 'due_soon',
      traceability_standard: 'NIST Traceable',
      traceability_cert_number: 'NIST-2024-0056789',
      uncertainty: '±2%',
      range_min: '0 Hz',
      range_max: '1 GHz',
      resolution: '1 MHz',
      accuracy: '±2%',
      condition: 'excellent',
      notes: 'High-frequency signal analysis and calibration',
      created_by: 1
    },
    {
      equipment_id: 'EQUIP-006',
      name: 'Humidity Chamber',
      category: 'Environmental',
      manufacturer: 'Espec',
      model: 'SH-241',
      serial_number: 'ESP241-445566',
      asset_tag: 'AST-006',
      location: 'Calibration Lab - Room 104',
      department: 'Environmental Testing',
      responsible_person: 'E. Mensah',
      purchase_date: '2021-09-10',
      purchase_cost: 25000.00,
      calibration_interval: 365,
      last_calibration_date: '2023-12-15',
      next_calibration_date: '2024-12-15',
      calibration_status: 'overdue',
      traceability_standard: 'UKAS Traceable',
      traceability_cert_number: 'UKAS-2023-E-789',
      uncertainty: '±2% RH',
      range_min: '10% RH',
      range_max: '95% RH',
      resolution: '0.1% RH',
      accuracy: '±2% RH',
      condition: 'fair',
      notes: 'Requires immediate calibration - overdue',
      created_by: 1
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO equipment (
      equipment_id, name, category, manufacturer, model, serial_number,
      asset_tag, location, department, responsible_person, purchase_date,
      purchase_cost, calibration_interval, last_calibration_date, next_calibration_date,
      calibration_status, traceability_standard, traceability_cert_number,
      uncertainty, range_min, range_max, resolution, accuracy, condition, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleEquipment.forEach(equip => {
    stmt.run(
      equip.equipment_id, equip.name, equip.category, equip.manufacturer,
      equip.model, equip.serial_number, equip.asset_tag, equip.location,
      equip.department, equip.responsible_person, equip.purchase_date,
      equip.purchase_cost, equip.calibration_interval, equip.last_calibration_date,
      equip.next_calibration_date, equip.calibration_status, equip.traceability_standard,
      equip.traceability_cert_number, equip.uncertainty, equip.range_min,
      equip.range_max, equip.resolution, equip.accuracy, equip.condition,
      equip.notes, equip.created_by
    );
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('Error inserting sample data:', err);
    } else {
      console.log('✓ Sample equipment added (6 items)');
    }
    
    db.close(() => {
      console.log('\n✅ Equipment table setup complete!');
    });
  });
});
