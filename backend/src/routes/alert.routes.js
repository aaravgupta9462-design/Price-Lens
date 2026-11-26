import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { alertController } from '../controllers/alert.controller.js';

const router = Router();

// Apply authenticateUser middleware to ALL /v1/alerts endpoints
router.use(authenticateUser);

// POST /v1/alerts/check - Manually trigger evaluation of active price target alerts
router.post('/check', alertController.checkAlerts);

// POST /v1/alerts - Create a new price target alert
router.post('/', alertController.createAlert);

// GET /v1/alerts - List price alerts for authenticated user (?active=true|false)
router.get('/', alertController.getUserAlerts);

// PUT /v1/alerts/:id - Update target price alert for authenticated owner
router.put('/:id', alertController.updateAlert);

// DELETE /v1/alerts/:id - Delete price alert for authenticated owner
router.delete('/:id', alertController.deleteAlert);

export default router;
