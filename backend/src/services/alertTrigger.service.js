import prisma from '../config/db.js';
import { comparisonService } from './comparison.service.js';
import { alertService } from './alert.service.js';

export class AlertTriggerService {
  /**
   * Determine the current relevant market price for a given alert configuration
   * @param {string} productId
   * @param {string|null} store
   * @returns {Promise<{ relevantPrice: number|null, storeOffer: Object|null }>}
   */
  async resolveCurrentPriceForAlert(productId, store) {
    const comparison = await comparisonService.compareByProductId(productId);
    if (!comparison) return { relevantPrice: null, storeOffer: null };

    if (store && String(store).trim()) {
      const cleanStore = String(store).trim().toLowerCase();
      const storeOffer = (comparison.offers || []).find(
        (o) => String(o.store).toLowerCase() === cleanStore && o.isAvailable !== false
      );
      if (storeOffer && typeof storeOffer.price === 'number' && storeOffer.price > 0) {
        return { relevantPrice: storeOffer.price, storeOffer };
      }
      return { relevantPrice: null, storeOffer: null };
    }

    // Any Store target -> lowest available selling price across all stores
    const lowestPrice = comparison.lowestPrice || comparison.bestDeal?.price;
    if (typeof lowestPrice === 'number' && lowestPrice > 0) {
      return { relevantPrice: lowestPrice, storeOffer: comparison.bestDeal || null };
    }

    return { relevantPrice: null, storeOffer: null };
  }

  /**
   * Evaluate a single active alert record against live market prices
   * @param {Object} alert - PriceAlert Prisma object
   */
  async evaluateSingleAlert(alert) {
    const now = new Date();
    const targetPrice = Number(alert.targetPrice);

    // 1. Resolve current market price for this product and store setting
    const { relevantPrice } = await this.resolveCurrentPriceForAlert(alert.productId, alert.store);

    if (relevantPrice === null || isNaN(relevantPrice) || relevantPrice <= 0) {
      // Store/Product price offer unavailable: update lastCheckedAt without triggering
      const updated = await prisma.priceAlert.update({
        where: { id: alert.id },
        data: { lastCheckedAt: now }
      });
      return { triggered: false, skipped: true, currentPrice: null, alert: alertService.formatAlert(updated) };
    }

    // 2. Evaluate trigger rule: currentRelevantPrice <= targetPrice
    const isTargetMet = relevantPrice <= targetPrice;

    if (isTargetMet) {
      // Trigger condition met: deactivate alert, set isTriggered=true, record triggeredAt & currentPrice
      const updated = await prisma.priceAlert.update({
        where: { id: alert.id },
        data: {
          isTriggered: true,
          isActive: false,
          triggeredAt: now,
          currentPrice: relevantPrice,
          lastCheckedAt: now
        }
      });
      return { triggered: true, skipped: false, currentPrice: relevantPrice, alert: alertService.formatAlert(updated) };
    } else {
      // Target price not reached: update currentPrice & lastCheckedAt, remain active
      const updated = await prisma.priceAlert.update({
        where: { id: alert.id },
        data: {
          currentPrice: relevantPrice,
          lastCheckedAt: now
        }
      });
      return { triggered: false, skipped: false, currentPrice: relevantPrice, alert: alertService.formatAlert(updated) };
    }
  }

  /**
   * Evaluate active, untriggered price alerts in the system
   * @param {Object} options - Optional filtering parameters (e.g. { userId, productId })
   * @returns {Promise<{ checked: number, triggered: number, skipped: number, failed: number, triggeredAlerts: Array }>}
   */
  async evaluateActiveAlerts(options = {}) {
    const { userId, productId } = typeof options === 'string' ? { userId: options } : options;

    const whereClause = {
      isActive: true,
      isTriggered: false,
      ...(userId ? { userId } : {}),
      ...(productId ? { productId } : {})
    };

    // Load active untriggered alerts directly from database
    const activeAlerts = await prisma.priceAlert.findMany({
      where: whereClause
    });

    let checkedCount = 0;
    let triggeredCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const triggeredAlerts = [];

    for (const alert of activeAlerts) {
      try {
        checkedCount++;
        const result = await this.evaluateSingleAlert(alert);

        if (result.triggered) {
          triggeredCount++;
          triggeredAlerts.push(result.alert);
        } else if (result.skipped) {
          skippedCount++;
        }
      } catch (err) {
        failedCount++;
        console.warn(`[AlertTriggerService] Error evaluating alert ${alert.id}:`, err.message);
      }
    }

    return {
      checked: checkedCount,
      triggered: triggeredCount,
      skipped: skippedCount,
      failed: failedCount,
      triggeredAlerts
    };
  }
}

export const alertTriggerService = new AlertTriggerService();
export default alertTriggerService;
