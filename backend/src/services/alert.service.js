import prisma from '../config/db.js';
import { comparisonService } from './comparison.service.js';

export class AlertService {
  /**
   * Helper to format Prisma Decimal or Number fields into clean Javascript numbers
   */
  formatAlert(alert) {
    if (!alert) return null;
    return {
      id: alert.id,
      userId: alert.userId,
      productId: alert.productId,
      store: alert.store || null,
      targetPrice: alert.targetPrice ? Number(alert.targetPrice) : 0,
      initialPrice: alert.initialPrice ? Number(alert.initialPrice) : 0,
      currentPrice: alert.currentPrice ? Number(alert.currentPrice) : 0,
      isActive: Boolean(alert.isActive),
      isTriggered: Boolean(alert.isTriggered),
      triggeredAt: alert.triggeredAt || null,
      lastCheckedAt: alert.lastCheckedAt || null,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt
    };
  }

  /**
   * Determine the relevant current price for a product & optional store target
   * @param {string} productId
   * @param {string|null} store
   */
  async getRelevantCurrentPrice(productId, store) {
    const comparison = await comparisonService.compareByProductId(productId);

    if (store && String(store).trim()) {
      const cleanStore = String(store).trim().toLowerCase();
      const storeOffer = (comparison.offers || []).find(
        (o) => String(o.store).toLowerCase() === cleanStore && o.isAvailable !== false
      );
      if (!storeOffer || typeof storeOffer.price !== 'number' || storeOffer.price <= 0) {
        const err = new Error(`No available store offer found for store "${store}" on this product.`);
        err.statusCode = 400;
        err.code = 'VALIDATION_ERROR';
        throw err;
      }
      return { relevantPrice: storeOffer.price, comparison };
    }

    // Default: Any Store -> lowest price across available store offers
    const lowestPrice = comparison.lowestPrice || comparison.bestDeal?.price;
    if (!lowestPrice || typeof lowestPrice !== 'number' || lowestPrice <= 0) {
      const err = new Error('Unable to determine current market price for this product.');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    return { relevantPrice: lowestPrice, comparison };
  }

  /**
   * Create a new price alert for an authenticated user
   */
  async createAlert(userId, { productId, store = null, targetPrice }) {
    if (!productId || typeof productId !== 'string') {
      const err = new Error('Product ID is required.');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const cleanProductId = productId.trim();
    const canonicalProduct = comparisonService.resolveCanonicalProduct(cleanProductId);

    if (!canonicalProduct) {
      const err = new Error(`Product "${cleanProductId}" not found in catalog.`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const numTarget = Number(targetPrice);
    if (isNaN(numTarget) || numTarget <= 0) {
      const err = new Error('Target price must be a positive number greater than 0.');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const cleanStore = store && String(store).trim() ? String(store).trim() : null;

    // 1. Fetch relevant current market price
    const { relevantPrice } = await this.getRelevantCurrentPrice(canonicalProduct.id, cleanStore);

    // 2. Validate targetPrice strictly lower than current price
    if (numTarget >= relevantPrice) {
      const err = new Error(
        `Target price (₹${numTarget.toLocaleString('en-IN')}) must be strictly lower than current price (₹${relevantPrice.toLocaleString('en-IN')}).`
      );
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // 3. Application-layer duplicate check via Prisma: no active alert for (userId, productId, store, targetPrice)
    const existingActive = await prisma.priceAlert.findFirst({
      where: {
        userId,
        productId: canonicalProduct.id,
        store: cleanStore,
        targetPrice: numTarget,
        isActive: true
      }
    });

    if (existingActive) {
      const err = new Error('An active price alert already exists for this product, store, and target price.');
      err.statusCode = 409;
      err.code = 'DUPLICATE_ALERT';
      throw err;
    }

    // 4. Save to Database via Prisma
    const createdAlert = await prisma.priceAlert.create({
      data: {
        userId,
        productId: canonicalProduct.id,
        store: cleanStore,
        targetPrice: numTarget,
        initialPrice: relevantPrice,
        currentPrice: relevantPrice,
        isActive: true,
        isTriggered: false,
        lastCheckedAt: new Date()
      }
    });

    return this.formatAlert(createdAlert);
  }

  /**
   * Fetch all alerts owned by the authenticated user
   */
  async getUserAlerts(userId, { active } = {}) {
    const whereClause = {
      userId,
      ...(active !== undefined ? { isActive: active === true } : {})
    };

    const rawAlerts = await prisma.priceAlert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return rawAlerts.map((a) => this.formatAlert(a));
  }

  /**
   * Update an existing price alert owned by the authenticated user
   */
  async updateAlert(userId, alertId, { targetPrice, store }) {
    const existingAlert = await prisma.priceAlert.findFirst({
      where: { id: alertId, userId }
    });

    if (!existingAlert) {
      const err = new Error('Price alert not found or does not belong to the user.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const numTarget = targetPrice !== undefined ? Number(targetPrice) : Number(existingAlert.targetPrice);
    if (isNaN(numTarget) || numTarget <= 0) {
      const err = new Error('Target price must be a positive number greater than 0.');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const targetStore = store !== undefined ? (store ? String(store).trim() : null) : existingAlert.store;

    // 1. Fetch current price
    const { relevantPrice } = await this.getRelevantCurrentPrice(existingAlert.productId, targetStore);

    // 2. Validate target strictly lower than current price
    if (numTarget >= relevantPrice) {
      const err = new Error(
        `Target price (₹${numTarget.toLocaleString('en-IN')}) must be strictly lower than current price (₹${relevantPrice.toLocaleString('en-IN')}).`
      );
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // 3. Duplicate check for updated values
    const duplicate = await prisma.priceAlert.findFirst({
      where: {
        userId,
        productId: existingAlert.productId,
        store: targetStore,
        targetPrice: numTarget,
        isActive: true,
        NOT: { id: alertId }
      }
    });

    if (duplicate) {
      const err = new Error('An active price alert already exists for this product, store, and target price.');
      err.statusCode = 409;
      err.code = 'DUPLICATE_ALERT';
      throw err;
    }

    // 4. Update in database via Prisma
    const updated = await prisma.priceAlert.update({
      where: { id: alertId },
      data: {
        targetPrice: numTarget,
        store: targetStore,
        currentPrice: relevantPrice,
        lastCheckedAt: new Date()
      }
    });

    return this.formatAlert(updated);
  }

  /**
   * Delete a price alert owned by the authenticated user
   */
  async deleteAlert(userId, alertId) {
    const existingAlert = await prisma.priceAlert.findFirst({
      where: { id: alertId, userId }
    });

    if (!existingAlert) {
      const err = new Error('Price alert not found or does not belong to the user.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    await prisma.priceAlert.delete({
      where: { id: alertId }
    });

    return true;
  }
}

export const alertService = new AlertService();
export default alertService;
