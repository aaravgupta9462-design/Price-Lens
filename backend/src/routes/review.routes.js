import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';

const router = Router();

// GET /v1/reviews/:productId - Retrieve Review Intelligence for a canonical product
router.get('/:productId', reviewController.getReviewIntelligence);

export default router;
