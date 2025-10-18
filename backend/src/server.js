/**
 * Calibration Management System - Main Server
 * Express server with RESTful API endpoints
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database');

// Import routes
const equipmentRoutes = require('./routes/equipment');
const clientsRoutes = require('./routes/clients');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: app.locals.db ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/clients', clientsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({ 
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const DB_PATH = path.join(__dirname, '..', 'calibration.db');

async function startServer() {
  try {
    // Initialize database
    const db = await initializeDatabase(DB_PATH);
    app.locals.db = db;

    // Start server
    app.listen(PORT, HOST, () => {
      console.log('\n🚀 Calibration Management Server');
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🌐 Server running at http://${HOST}:${PORT}`);
      console.log(`📊 Database: ${DB_PATH}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      console.log('Available endpoints:');
      console.log(`  GET    /health`);
      console.log(`  GET    /api/equipment`);
      console.log(`  GET    /api/equipment/stats`);
      console.log(`  GET    /api/equipment/:id`);
      console.log(`  POST   /api/equipment`);
      console.log(`  PUT    /api/equipment/:id`);
      console.log(`  DELETE /api/equipment/:id`);
      console.log(`  GET    /api/clients`);
      console.log(`  GET    /api/clients/stats`);
      console.log(`  GET    /api/clients/:id`);
      console.log(`  POST   /api/clients`);
      console.log(`  PUT    /api/clients/:id`);
      console.log(`  DELETE /api/clients/:id`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (app.locals.db) {
    app.locals.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('📊 Database connection closed');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start the server
startServer();

module.exports = app;
