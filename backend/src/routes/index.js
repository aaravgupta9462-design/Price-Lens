import { Router } from 'express';
import authRoutes from './auth.routes.js';
import comparisonRoutes from './comparison.routes.js';
import priceHistoryRoutes from './priceHistory.routes.js';

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

// /v1/compare routes (FEATURE 1: Multi-Store Compare)
router.use('/compare', comparisonRoutes);

// /v1/price-history routes (FEATURE 2: Price History)
router.use('/price-history', priceHistoryRoutes);

export default router;

