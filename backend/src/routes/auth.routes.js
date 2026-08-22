import { Router } from 'express';

const router = Router();

// Temporary route structure ready for authentication implementation in Step 3
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PriceLens Authentication API router is active'
  });
});

export default router;
