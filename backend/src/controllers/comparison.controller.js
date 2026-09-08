import { z } from 'zod';
import { comparisonService } from '../services/comparison.service.js';

// Input Validation Schemas
const searchQuerySchema = z.object({
  q: z
    .string({ required_error: 'Search query parameter "q" is required.' })
    .trim()
    .min(2, 'Search query must be at least 2 characters long.')
    .max(100, 'Search query cannot exceed 100 characters.')
});

const productIdParamSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(2, 'Product ID must be at least 2 characters.')
    .max(80, 'Product ID cannot exceed 80 characters.')
});

export const comparisonController = {
  /**
   * GET /v1/compare?q=...
   * Search and compare offers across stores
   */
  async compareQuery(req, res, next) {
    try {
      const validated = searchQuerySchema.safeParse(req.query);
      if (!validated.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Invalid search query.'
        });
      }

      const result = await comparisonService.compareQuery(validated.data.q);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Product comparison retrieved successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /v1/compare/:productId
   * Get store offers for a specific product ID
   */
  async compareByProductId(req, res, next) {
    try {
      const validated = productIdParamSchema.safeParse(req.params);
      if (!validated.success) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Invalid product ID.'
        });
      }

      const result = await comparisonService.compareByProductId(validated.data.productId);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Product store comparison retrieved successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /v1/compare/stores/list
   * Get list of enabled store adapters and statuses
   */
  async getStores(req, res, next) {
    try {
      const stores = comparisonService.getStores();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: stores
      });
    } catch (err) {
      next(err);
    }
  }
};

export default comparisonController;
