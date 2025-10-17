/**
 * Simple Server Test - Minimal version for Railway health check testing
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Basic middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow Railway and Netlify domains in production
    if (process.env.NODE_ENV === 'production') {
      if (origin.includes('.railway.app') || origin.includes('.netlify.app')) {
        return callback(null, true);
      }
    }
    
    // Default local development
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Test Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

console.log('🚀 Server started successfully - ready for Railway deployment');