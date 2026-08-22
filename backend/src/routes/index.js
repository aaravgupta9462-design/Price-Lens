import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// /v1 API Root Endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PriceLens API v1 Root'
  });
});

// /v1/auth routes
router.use('/auth', authRoutes);

export default router;
