import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'connected',
    auth: 'enabled',
    environment: process.env.NODE_ENV,
  });
});

// API routes
router.use('/auth', authRoutes);

export default router;
