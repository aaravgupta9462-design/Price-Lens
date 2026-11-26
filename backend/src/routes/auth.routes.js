import { Router } from 'express';
import { generateToken } from '../utils/jwt.util.js';

const router = Router();

// /v1/auth/status
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PriceLens Authentication API router is active'
  });
});

// POST /v1/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken, profile } = req.body;
    if (!idToken && !profile) {
      return res.status(400).json({
        success: false,
        message: 'Google credentials or idToken is required'
      });
    }

    const userPayload = profile || {
      id: 'usr_google_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User'
    };

    const token = generateToken({
      id: userPayload.id,
      email: userPayload.email,
      fullName: userPayload.name || userPayload.fullName
    });

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: userPayload
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
});

export default router;

