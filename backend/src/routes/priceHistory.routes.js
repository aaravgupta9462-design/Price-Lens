import { Router } from 'express';
import { priceHistoryController } from '../controllers/priceHistory.controller.js';

const router = Router();

// POST /v1/price-history/snapshot - Manually record a snapshot
router.post('/snapshot', priceHistoryController.recordSnapshot);

// GET /v1/price-history/:productId - Retrieve historical prices & chart data
router.get('/:productId', priceHistoryController.getPriceHistory);

export default router;
