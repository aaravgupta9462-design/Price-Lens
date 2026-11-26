import prisma from '../config/db.js';
import { comparisonService } from './comparison.service.js';

export class ReviewService {
  /**
   * Format Prisma ReviewIntelligence record and Product info into JSON-safe response schema
   * Converts Prisma Decimal trustScore to standard JS Number.
   */
  formatReviewResponse(record, productInfo) {
    if (!record) return null;

    return {
      product: {
        id: productInfo?.id || record.productId,
        name: productInfo?.name || record.productId.replace(/-/g, ' '),
        brand: productInfo?.brand || null,
        category: productInfo?.category || null
      },
      reviewIntelligence: {
        id: record.id,
        productId: record.productId,
        trustScore: record.trustScore != null ? Number(record.trustScore) : 0,
        reliabilityTag: record.reliabilityTag,
        authenticityBreakdown: record.authenticityBreakdown,
        sentimentDistribution: record.sentimentDistribution,
        positivePoints: record.positivePoints,
        complaintPoints: record.complaintPoints,
        sampleReviews: record.sampleReviews,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }
    };
  }

  /**
   * Fetch Review Intelligence record for a given canonical product ID
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async getReviewIntelligence(productId) {
    const cleanId = String(productId || '').trim();
    if (!cleanId) {
      const err = new Error('Product ID is required.');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // 1. Resolve canonical product identity or check Product record in database
    const canonicalProduct = comparisonService.resolveCanonicalProduct(cleanId);
    let dbProduct = null;

    if (prisma) {
      dbProduct = await prisma.product.findUnique({
        where: { id: canonicalProduct ? canonicalProduct.id : cleanId }
      });
    }

    // If neither canonical product nor DB product exists, return 404
    if (!canonicalProduct && !dbProduct) {
      const err = new Error(`Product with ID "${cleanId}" not found.`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const targetProductId = canonicalProduct ? canonicalProduct.id : dbProduct.id;

    // 2. Fetch ReviewIntelligence record from database
    const reviewRecord = await prisma.reviewIntelligence.findUnique({
      where: { productId: targetProductId },
      include: { product: true }
    });

    // If product exists but no ReviewIntelligence record exists, return 404
    if (!reviewRecord) {
      const err = new Error(`Review Intelligence is not available for product "${cleanId}".`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const productInfo = reviewRecord.product || canonicalProduct || dbProduct;
    return this.formatReviewResponse(reviewRecord, productInfo);
  }
}

export const reviewService = new ReviewService();
export default reviewService;
