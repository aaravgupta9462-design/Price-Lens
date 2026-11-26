import { reviewService } from '../services/review.service.js';

export const reviewController = {
  /**
   * GET /v1/reviews/:productId
   * Retrieve structured Review Intelligence for a product
   */
  async getReviewIntelligence(req, res, next) {
    try {
      const { productId } = req.params;
      const data = await reviewService.getReviewIntelligence(productId);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Review Intelligence retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
};

export default reviewController;
