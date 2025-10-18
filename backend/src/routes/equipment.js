/**
 * Equipment Routes
 * CRUD operations for equipment management
 */

const express = require('express');
const router = express.Router();

// GET /api/equipment - List all equipment with filtering
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    category = 'all',
    calibrationDue = 'all'
  } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const db = req.app.locals.db;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Search filter
    if (search) {
      whereClause += ' AND (name LIKE ? OR serial_number LIKE ? OR model LIKE ? OR manufacturer LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Category filter
    if (category !== 'all') {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    // Calibration due filter
    if (calibrationDue === 'overdue') {
      whereClause += ' AND next_calibration_date < date("now")';
    } else if (calibrationDue === 'due-soon') {
      whereClause += ' AND next_calibration_date BETWEEN date("now") AND date("now", "+30 days")';
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM equipment ${whereClause}`;
    const countResult = await new Promise((resolve, reject) => {
      db.get(countQuery, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Get equipment list
    const listQuery = `
      SELECT * FROM equipment 
      ${whereClause}
      ORDER BY name ASC
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit), offset);

    const equipment = await new Promise((resolve, reject) => {
      db.all(listQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      data: equipment,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Equipment list error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment', message: error.message });
  }
});

// GET /api/equipment/stats - Get equipment statistics
router.get('/stats', async (req, res) => {
  try {
    const db = req.app.locals.db;

    const stats = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'calibration-due' THEN 1 ELSE 0 END) as calibrationDue,
          SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
          SUM(CASE WHEN status = 'retired' THEN 1 ELSE 0 END) as retired,
          SUM(CASE WHEN next_calibration_date < date('now') THEN 1 ELSE 0 END) as overdue
        FROM equipment
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Get by category
    const byCategory = await new Promise((resolve, reject) => {
      db.all(`
        SELECT category, COUNT(*) as count
        FROM equipment
        GROUP BY category
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      ...stats,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('Equipment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// GET /api/equipment/:id - Get single equipment
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const equipment = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM equipment WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Get calibration history
    const calibrations = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM calibrations WHERE equipment_id = ? ORDER BY calibration_date DESC LIMIT 10',
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      ...equipment,
      calibrationHistory: calibrations
    });

  } catch (error) {
    console.error('Equipment fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment', message: error.message });
  }
});

// POST /api/equipment - Create new equipment
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      name,
      serialNumber,
      model,
      manufacturer,
      category,
      status = 'active',
      location,
      purchaseDate,
      lastCalibrationDate,
      nextCalibrationDate,
      calibrationInterval = 12,
      specifications,
      notes
    } = req.body;

    // Validation
    if (!name || !serialNumber || !category) {
      return res.status(400).json({ error: 'Name, serial number, and category are required' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO equipment (
          name, serial_number, model, manufacturer, category, status,
          location, purchase_date, last_calibration_date, next_calibration_date,
          calibration_interval, specifications, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
      [
        name, serialNumber, model, manufacturer, category, status,
        location, purchaseDate, lastCalibrationDate, nextCalibrationDate,
        calibrationInterval, JSON.stringify(specifications || {}), notes
      ],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    res.status(201).json({
      message: 'Equipment created successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Equipment create error:', error);
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Equipment with this serial number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create equipment', message: error.message });
    }
  }
});

// PUT /api/equipment/:id - Update equipment
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const {
      name,
      serialNumber,
      model,
      manufacturer,
      category,
      status,
      location,
      purchaseDate,
      lastCalibrationDate,
      nextCalibrationDate,
      calibrationInterval,
      specifications,
      notes
    } = req.body;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE equipment SET
          name = ?, serial_number = ?, model = ?, manufacturer = ?,
          category = ?, status = ?, location = ?, purchase_date = ?,
          last_calibration_date = ?, next_calibration_date = ?,
          calibration_interval = ?, specifications = ?, notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `,
      [
        name, serialNumber, model, manufacturer, category, status,
        location, purchaseDate, lastCalibrationDate, nextCalibrationDate,
        calibrationInterval, JSON.stringify(specifications || {}), notes, id
      ],
      function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Equipment not found'));
        else resolve();
      });
    });

    res.json({ message: 'Equipment updated successfully' });

  } catch (error) {
    console.error('Equipment update error:', error);
    if (error.message === 'Equipment not found') {
      res.status(404).json({ error: 'Equipment not found' });
    } else {
      res.status(500).json({ error: 'Failed to update equipment', message: error.message });
    }
  }
});

// DELETE /api/equipment/:id - Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    // Check if equipment has calibrations
    const calibrationCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM calibrations WHERE equipment_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (calibrationCount > 0) {
      return res.status(409).json({ 
        error: 'Cannot delete equipment with calibration history',
        message: `This equipment has ${calibrationCount} calibration record(s). Please archive instead.`
      });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM equipment WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else if (this.changes === 0) reject(new Error('Equipment not found'));
        else resolve();
      });
    });

    res.json({ message: 'Equipment deleted successfully' });

  } catch (error) {
    console.error('Equipment delete error:', error);
    if (error.message === 'Equipment not found') {
      res.status(404).json({ error: 'Equipment not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete equipment', message: error.message });
    }
  }
});

module.exports = router;
