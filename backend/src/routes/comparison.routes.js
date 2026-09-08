import { Router } from 'express';
import { comparisonController } from '../controllers/comparison.controller.js';

const router = Router();

// GET /v1/compare/stores - List all enabled store adapters
router.get('/stores', comparisonController.getStores);

// GET /v1/compare?q=... - Search products & compare across stores
router.get('/', comparisonController.compareQuery);

// GET /v1/compare/:productId - Compare stores for a specific product
router.get('/:productId', comparisonController.compareByProductId);

export default router;
