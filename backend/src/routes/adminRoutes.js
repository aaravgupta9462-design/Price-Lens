import express from 'express';
import { storeRegistry } from '../integrations/registry.js';

const router = express.Router();

/**
 * GET /api/admin/stores
 * Returns status overview for all store adapters.
 */
router.get('/stores', (req, res) => {
  const statuses = storeRegistry.getStoreStatuses();
  return res.json({
    success: true,
    totalStores: statuses.length,
    configuredStores: statuses.filter((s) => s.isConfigured).length,
    stores: statuses
  });
});

export default router;
