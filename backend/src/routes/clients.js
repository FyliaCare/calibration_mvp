/**
 * Clients Routes
 * CRUD operations for client management
 */

const express = require('express');
const router = express.Router();

// GET /api/clients - List all clients with filtering
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    accountType = 'all'
  } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const db = req.app.locals.db;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Search filter
    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR contact_person LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Account type filter
    if (accountType !== 'all') {
      whereClause += ' AND account_type = ?';
      params.push(accountType);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM clients ${whereClause}`;
    const countResult = await new Promise((resolve, reject) => {
      db.get(countQuery, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Get clients list
    const listQuery = `
      SELECT * FROM clients 
      ${whereClause}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit), offset);

    const clients = await new Promise((resolve, reject) => {
      db.all(listQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      data: clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Clients list error:', error);
    res.status(500).json({ error: 'Failed to fetch clients', message: error.message });
  }
});

// GET /api/clients/stats - Get client statistics
router.get('/stats', async (req, res) => {
  try {
    const db = req.app.locals.db;

    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
        FROM clients
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Get by account type
    const byAccountType = await new Promise((resolve, reject) => {
      db.all(`
        SELECT account_type, COUNT(*) as count
        FROM clients
        GROUP BY account_type
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get total jobs and revenue
    const jobStats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as totalJobs,
          SUM(CASE WHEN status IN ('in-progress', 'pending') THEN 1 ELSE 0 END) as activeJobs,
          COALESCE(SUM(CAST(json_extract(total_revenue, '$') AS REAL)), 0) as totalRevenue
        FROM clients
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.json({
      ...stats,
      ...jobStats,
      byAccountType: byAccountType.reduce((acc, item) => {
        acc[item.account_type] = item.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('Client stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// GET /api/clients/:id - Get single client with details
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const client = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Get contacts
    const contacts = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM client_contacts WHERE client_id = ?', [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get assigned equipment
    const equipment = await new Promise((resolve, reject) => {
      db.all(`
        SELECT e.* 
        FROM equipment e
        INNER JOIN client_equipment ce ON e.id = ce.equipment_id
        WHERE ce.client_id = ?
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get calibration activity
    const activity = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.* 
        FROM calibrations c
        WHERE c.client_id = ?
        ORDER BY c.calibration_date DESC
        LIMIT 20
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      ...client,
      contacts,
      assignedEquipment: equipment,
      recentActivity: activity
    });

  } catch (error) {
    console.error('Client fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch client', message: error.message });
  }
});

// POST /api/clients - Create new client
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country = 'USA',
      contactPerson,
      accountType = 'standard',
      status = 'active',
      notes
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO clients (
          name, email, phone, address, city, state, zip_code, country,
          contact_person, account_type, status, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
      [
        name, email, phone, address, city, state, zipCode, country,
        contactPerson, accountType, status, notes
      ],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    res.status(201).json({
      message: 'Client created successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Client create error:', error);
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Client with this email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create client', message: error.message });
    }
  }
});

// PUT /api/clients/:id - Update client
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      contactPerson,
      accountType,
      status,
      notes
    } = req.body;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE clients SET
          name = ?, email = ?, phone = ?, address = ?, city = ?,
          state = ?, zip_code = ?, country = ?, contact_person = ?,
          account_type = ?, status = ?, notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `,
      [
        name, email, phone, address, city, state, zipCode, country,
        contactPerson, accountType, status, notes, id
      ],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Client not found'));
        else resolve();
      });
    });

    res.json({ message: 'Client updated successfully' });

  } catch (error) {
    console.error('Client update error:', error);
    if (error.message === 'Client not found') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ error: 'Failed to update client', message: error.message });
    }
  }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    // Check if client has calibrations
    const calibrationCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM calibrations WHERE client_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (calibrationCount > 0) {
      return res.status(409).json({ 
        error: 'Cannot delete client with calibration history',
        message: `This client has ${calibrationCount} calibration record(s). Please set to inactive instead.`
      });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM clients WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Client not found'));
        else resolve();
      });
    });

    res.json({ message: 'Client deleted successfully' });

  } catch (error) {
    console.error('Client delete error:', error);
    if (error.message === 'Client not found') {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete client', message: error.message });
    }
  }
});

// POST /api/clients/:id/contacts - Add contact to client
router.post('/:id/contacts', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { name, email, phone, role, isPrimary = false } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO client_contacts (
          client_id, name, email, phone, role, is_primary,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      [id, name, email, phone, role, isPrimary ? 1 : 0],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    res.status(201).json({
      message: 'Contact added successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Contact create error:', error);
    res.status(500).json({ error: 'Failed to add contact', message: error.message });
  }
});

// PUT /api/clients/:id/contacts/:contactId - Update contact
router.put('/:id/contacts/:contactId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { contactId } = req.params;
    const { name, email, phone, role, isPrimary } = req.body;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE client_contacts SET
          name = ?, email = ?, phone = ?, role = ?, is_primary = ?
        WHERE id = ?
      `,
      [name, email, phone, role, isPrimary ? 1 : 0, contactId],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Contact not found'));
        else resolve();
      });
    });

    res.json({ message: 'Contact updated successfully' });

  } catch (error) {
    console.error('Contact update error:', error);
    if (error.message === 'Contact not found') {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.status(500).json({ error: 'Failed to update contact', message: error.message });
    }
  }
});

// DELETE /api/clients/:id/contacts/:contactId - Delete contact
router.delete('/:id/contacts/:contactId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { contactId } = req.params;

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM client_contacts WHERE id = ?', [contactId], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Contact not found'));
        else resolve();
      });
    });

    res.json({ message: 'Contact deleted successfully' });

  } catch (error) {
    console.error('Contact delete error:', error);
    if (error.message === 'Contact not found') {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete contact', message: error.message });
    }
  }
});

module.exports = router;
