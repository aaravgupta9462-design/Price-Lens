import { z } from 'zod';
import { priceHistoryService } from '../services/priceHistory.service.js';

const productIdParamSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(2, 'Product ID must be at least 2 characters.')
    .max(80, 'Product ID cannot exceed 80 characters.')
});

const timelineQuerySchema = z.object({
  timeline: z
    .enum(['7D', '30D', '90D', '3M', '6M', 'ALL', '7d', '30d', '90d', '3m', '6m', 'all'])
    .optional()
    .default('30D')
});

const snapshotBodySchema = z.object({
  productId: z.string().min(2),
  store: z.string().min(2),
  price: z.number().positive(),
  currency: z.string().optional().default('INR'),
  title: z.string().optional()
});

export const priceHistoryController = {
  /**
   * GET /v1/price-history/:productId?timeline=30D
   * Retrieve price history and statistical metrics for a product
   */
  async getPriceHistory(req, res, next) {
    try {
      const validatedParam = productIdParamSchema.safeParse(req.params);
      if (!validatedParam.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validatedParam.error.errors[0]?.message || 'Invalid product ID.'
        });
      }

      const validatedQuery = timelineQuerySchema.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: 'Invalid timeline parameter. Allowed values: 7D, 30D, 3M, 6M, 90D, ALL'
        });
      }

      const timeline = (validatedQuery.data.timeline || '30D').toUpperCase();

      const historyData = await priceHistoryService.getHistoricalPrices(
        validatedParam.data.productId,
        { timeline }
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: historyData.hasHistory
          ? 'Price history retrieved successfully'
          : historyData.message,
        data: historyData
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /v1/price-history/snapshot
   * Manually record a price snapshot (useful for testing or external webhooks)
   */
  async recordSnapshot(req, res, next) {
    try {
      const validated = snapshotBodySchema.safeParse(req.body);
      if (!validated.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Invalid snapshot payload.'
        });
      }

      const result = await priceHistoryService.savePriceSnapshot(validated.data);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: result.skipped ? 'Snapshot skipped (already recorded recently)' : 'Price snapshot saved successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};

export default priceHistoryController;
