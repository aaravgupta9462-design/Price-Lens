import { z } from 'zod';
import { alertService } from '../services/alert.service.js';
import { alertTriggerService } from '../services/alertTrigger.service.js';

const createAlertSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required.' })
    .trim()
    .min(2, 'Product ID must be at least 2 characters.'),
  store: z.string().trim().nullable().optional(),
  targetPrice: z
    .number({ required_error: 'Target price is required.' })
    .positive('Target price must be greater than 0.')
});

const updateAlertSchema = z.object({
  targetPrice: z
    .number({ required_error: 'Target price is required.' })
    .positive('Target price must be greater than 0.')
    .optional(),
  store: z.string().trim().nullable().optional()
});

export const alertController = {
  /**
   * POST /v1/alerts
   * Create a new price alert for the authenticated user
   */
  async createAlert(req, res, next) {
    try {
      const validated = createAlertSchema.safeParse(req.body);
      if (!validated.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Invalid price alert input.'
        });
      }

      const userId = req.user.id;
      const result = await alertService.createAlert(userId, validated.data);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Price alert created successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /v1/alerts
   * List price alerts belonging to the authenticated user
   */
  async getUserAlerts(req, res, next) {
    try {
      const userId = req.user.id;
      let activeFilter;
      if (req.query.active !== undefined) {
        activeFilter = String(req.query.active).toLowerCase() === 'true';
      }

      const alerts = await alertService.getUserAlerts(userId, { active: activeFilter });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Price alerts retrieved successfully',
        count: alerts.length,
        data: alerts
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /v1/alerts/:id
   * Update an existing target price alert for the authenticated owner
   */
  async updateAlert(req, res, next) {
    try {
      const { id } = req.params;
      const validated = updateAlertSchema.safeParse(req.body);
      if (!validated.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Invalid price alert update payload.'
        });
      }

      const userId = req.user.id;
      const updated = await alertService.updateAlert(userId, id, validated.data);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Price alert updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /v1/alerts/:id
   * Permanently delete a price alert owned by the authenticated user
   */
  async deleteAlert(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await alertService.deleteAlert(userId, id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Price alert deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /v1/alerts/check
   * Trigger evaluation of active price target alerts for authenticated user
   */
  async checkAlerts(req, res, next) {
    try {
      const userId = req.user.id;
      const summary = await alertTriggerService.evaluateActiveAlerts({ userId });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Price alerts evaluated successfully',
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }
};

export default alertController;
