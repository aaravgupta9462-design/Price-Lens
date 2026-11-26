import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { comparisonController } from '../controllers/comparison.controller.js';

const router = Router();

// Dedicated rate limiter for multi-store price comparisons (30 requests/min per IP)
const compareLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many price comparison searches. Please wait a moment before trying again.'
  }
});

// GET /v1/compare/stores - List all enabled store adapters
router.get('/stores', comparisonController.getStores);

// GET /v1/compare?q=... - Search products & compare across stores
router.get('/', compareLimiter, comparisonController.compareQuery);

// GET /v1/compare/:productId - Compare stores for a specific product
router.get('/:productId', compareLimiter, comparisonController.compareByProductId);

export default router;
