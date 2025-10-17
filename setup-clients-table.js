const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

console.log('Creating clients table...');

db.serialize(() => {
  // Drop existing tables if they exist (for clean setup)
  db.run(`DROP TABLE IF EXISTS client_contacts`);
  db.run(`DROP TABLE IF EXISTS clients`);
  
  // Create clients table
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT UNIQUE NOT NULL,
      company_name TEXT NOT NULL,
      contact_person TEXT,
      email TEXT,
      phone TEXT,
      mobile TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT DEFAULT 'Ghana',
      industry TEXT,
      client_type TEXT DEFAULT 'corporate',
      status TEXT DEFAULT 'active',
      tax_id TEXT,
      registration_number TEXT,
      payment_terms TEXT DEFAULT 'Net 30',
      credit_limit REAL,
      website TEXT,
      notes TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating clients table:', err);
    } else {
      console.log('✓ Clients table created');
    }
  });

  // Create client_contacts table for multiple contacts per client
  db.run(`
    CREATE TABLE IF NOT EXISTS client_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      position TEXT,
      email TEXT,
      phone TEXT,
      mobile TEXT,
      is_primary INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating client_contacts table:', err);
    } else {
      console.log('✓ Client contacts table created');
    }
  });

  // Insert sample clients
  const sampleClients = [
    {
      client_id: 'CLT-001',
      company_name: 'Ghana Oil Company Limited',
      contact_person: 'Kwame Mensah',
      email: 'kmensah@gocoil.com.gh',
      phone: '+233 30 276 5432',
      mobile: '+233 24 555 1234',
      address: 'Liberation Road, Airport Residential Area',
      city: 'Accra',
      state: 'Greater Accra',
      postal_code: 'GA-123-4567',
      country: 'Ghana',
      industry: 'Oil & Gas',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0001234567',
      registration_number: 'REG-2010-0001234',
      payment_terms: 'Net 30',
      credit_limit: 500000.00,
      website: 'www.gocoil.com.gh',
      notes: 'Major oil company - priority client with monthly calibration schedule',
      created_by: 1
    },
    {
      client_id: 'CLT-002',
      company_name: 'Volta River Authority',
      contact_person: 'Ama Osei',
      email: 'aosei@vra.com.gh',
      phone: '+233 30 266 1234',
      mobile: '+233 20 888 5678',
      address: 'Electro-Volta House, 28th February Road',
      city: 'Accra',
      state: 'Greater Accra',
      postal_code: 'GA-567-8901',
      country: 'Ghana',
      industry: 'Power Generation',
      client_type: 'government',
      status: 'active',
      tax_id: 'TIN-G0002345678',
      registration_number: 'REG-1965-0000111',
      payment_terms: 'Net 45',
      credit_limit: 800000.00,
      website: 'www.vra.com',
      notes: 'Government entity - electrical testing equipment calibration quarterly',
      created_by: 1
    },
    {
      client_id: 'CLT-003',
      company_name: 'Golden Star Resources Ltd',
      contact_person: 'John Agyeman',
      email: 'j.agyeman@gsr.com',
      phone: '+233 34 220 3456',
      mobile: '+233 24 333 7890',
      address: 'Bogoso-Prestea Mining Area',
      city: 'Prestea',
      state: 'Western Region',
      postal_code: 'WR-234-5678',
      country: 'Ghana',
      industry: 'Mining',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0003456789',
      registration_number: 'REG-1992-0002345',
      payment_terms: 'Net 30',
      credit_limit: 600000.00,
      website: 'www.gsr.com',
      notes: 'Mining equipment calibration - pressure, temperature, dimensional tools',
      created_by: 1
    },
    {
      client_id: 'CLT-004',
      company_name: 'Tullow Ghana Limited',
      contact_person: 'Sarah Boateng',
      email: 's.boateng@tullowoil.com',
      phone: '+233 30 274 8900',
      mobile: '+233 24 222 3456',
      address: 'Jubilee House, 7 Volta Street',
      city: 'Accra',
      state: 'Greater Accra',
      postal_code: 'GA-345-6789',
      country: 'Ghana',
      industry: 'Oil & Gas',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0004567890',
      registration_number: 'REG-2006-0003456',
      payment_terms: 'Net 30',
      credit_limit: 750000.00,
      website: 'www.tullowoil.com',
      notes: 'Offshore drilling operations - specialized pressure equipment calibration',
      created_by: 1
    },
    {
      client_id: 'CLT-005',
      company_name: 'Ghana Water Company Limited',
      contact_person: 'Emmanuel Kwarteng',
      email: 'e.kwarteng@gwcl.com.gh',
      phone: '+233 30 266 5544',
      mobile: '+233 20 444 5678',
      address: 'Ministries Post Office',
      city: 'Accra',
      state: 'Greater Accra',
      postal_code: 'GA-789-0123',
      country: 'Ghana',
      industry: 'Water Utilities',
      client_type: 'government',
      status: 'active',
      tax_id: 'TIN-G0005678901',
      registration_number: 'REG-1965-0000222',
      payment_terms: 'Net 60',
      credit_limit: 400000.00,
      website: 'www.gwcl.com.gh',
      notes: 'Flow meters and pressure testing equipment - bi-annual calibration',
      created_by: 1
    },
    {
      client_id: 'CLT-006',
      company_name: 'AngloGold Ashanti (Ghana) Limited',
      contact_person: 'Akua Mensah',
      email: 'amensah@anglogoldashanti.com',
      phone: '+233 34 220 7890',
      mobile: '+233 24 555 9012',
      address: 'Obuasi Mine Site',
      city: 'Obuasi',
      state: 'Ashanti Region',
      postal_code: 'AS-456-7890',
      country: 'Ghana',
      industry: 'Mining',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0006789012',
      registration_number: 'REG-1897-0000333',
      payment_terms: 'Net 30',
      credit_limit: 900000.00,
      website: 'www.anglogoldashanti.com',
      notes: 'Large mining operation - comprehensive calibration services for all equipment types',
      created_by: 1
    },
    {
      client_id: 'CLT-007',
      company_name: 'Nestle Ghana Limited',
      contact_person: 'Daniel Owusu',
      email: 'd.owusu@nestle.com.gh',
      phone: '+233 30 277 1234',
      mobile: '+233 24 666 7890',
      address: 'Industrial Area, Spintex Road',
      city: 'Tema',
      state: 'Greater Accra',
      postal_code: 'GA-901-2345',
      country: 'Ghana',
      industry: 'Food & Beverage',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0007890123',
      registration_number: 'REG-1957-0000444',
      payment_terms: 'Net 30',
      credit_limit: 450000.00,
      website: 'www.nestle.com.gh',
      notes: 'Temperature and pressure monitoring equipment for production line',
      created_by: 1
    },
    {
      client_id: 'CLT-008',
      company_name: 'Tema Oil Refinery',
      contact_person: 'Grace Appiah',
      email: 'g.appiah@tor.com.gh',
      phone: '+233 30 320 2345',
      mobile: '+233 20 777 8901',
      address: 'TOR Access Road',
      city: 'Tema',
      state: 'Greater Accra',
      postal_code: 'GA-012-3456',
      country: 'Ghana',
      industry: 'Oil Refining',
      client_type: 'government',
      status: 'active',
      tax_id: 'TIN-G0008901234',
      registration_number: 'REG-1963-0000555',
      payment_terms: 'Net 45',
      credit_limit: 700000.00,
      website: 'www.tor.gov.gh',
      notes: 'Refinery operations - critical pressure and temperature equipment calibration',
      created_by: 1
    },
    {
      client_id: 'CLT-009',
      company_name: 'Fan Milk Limited',
      contact_person: 'Patrick Asante',
      email: 'p.asante@fanmilk.com',
      phone: '+233 30 277 4567',
      mobile: '+233 24 888 9012',
      address: 'Avenor Industrial Area',
      city: 'Accra',
      state: 'Greater Accra',
      postal_code: 'GA-123-4567',
      country: 'Ghana',
      industry: 'Food & Beverage',
      client_type: 'corporate',
      status: 'inactive',
      tax_id: 'TIN-C0009012345',
      registration_number: 'REG-1960-0000666',
      payment_terms: 'Net 30',
      credit_limit: 300000.00,
      website: 'www.fanmilk.com',
      notes: 'Temperature monitoring equipment - currently inactive, contract renewal pending',
      created_by: 1
    },
    {
      client_id: 'CLT-010',
      company_name: 'Guinness Ghana Breweries Limited',
      contact_person: 'Rebecca Mensah',
      email: 'r.mensah@guinness-ghana.com',
      phone: '+233 30 266 8901',
      mobile: '+233 24 999 0123',
      address: 'Industrial Area, Kasei',
      city: 'Kumasi',
      state: 'Ashanti Region',
      postal_code: 'AS-567-8901',
      country: 'Ghana',
      industry: 'Brewery',
      client_type: 'corporate',
      status: 'active',
      tax_id: 'TIN-C0010123456',
      registration_number: 'REG-1960-0000777',
      payment_terms: 'Net 30',
      credit_limit: 500000.00,
      website: 'www.guinness-ghana.com',
      notes: 'Temperature and pressure equipment for brewing processes - quarterly calibration',
      created_by: 1
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO clients (
      client_id, company_name, contact_person, email, phone, mobile,
      address, city, state, postal_code, country, industry, client_type,
      status, tax_id, registration_number, payment_terms, credit_limit,
      website, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleClients.forEach(client => {
    stmt.run(
      client.client_id, client.company_name, client.contact_person, client.email,
      client.phone, client.mobile, client.address, client.city, client.state,
      client.postal_code, client.country, client.industry, client.client_type,
      client.status, client.tax_id, client.registration_number, client.payment_terms,
      client.credit_limit, client.website, client.notes, client.created_by
    );
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('Error inserting clients:', err);
    } else {
      console.log('✓ Sample clients added (10 clients)');
      console.log('  - Active: 9 clients');
      console.log('  - Inactive: 1 client');
      console.log('  - Corporate: 7 clients');
      console.log('  - Government: 3 clients');
    }
    
    db.close(() => {
      console.log('\n✅ Clients table setup complete!');
    });
  });
});
