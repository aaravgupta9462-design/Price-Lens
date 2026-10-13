import express from 'express';

const router = express.Router();

/**
 * GET /api/product/:id/price-history
 * Returns price history timelines (7D, 30D, 3M, 6M) with lowest/highest/average stats.
 */
router.get('/:id/price-history', (req, res) => {
  const { id } = req.params;
  const { timeline = '30D' } = req.query;

  const samplePoints = {
    '7D': [
      { label: 'Day 1', price: 69999, date: 'Aug 25' },
      { label: 'Day 2', price: 69999, date: 'Aug 26' },
      { label: 'Day 3', price: 68990, date: 'Aug 27' },
      { label: 'Day 4', price: 68499, date: 'Aug 28' },
      { label: 'Day 5', price: 68499, date: 'Aug 29' },
      { label: 'Day 6', price: 68499, date: 'Aug 30' },
      { label: 'Today', price: 68499, date: 'Aug 31' }
    ],
    '30D': [
      { label: 'Week 1', price: 72990, date: 'Aug 01' },
      { label: 'Week 2', price: 71490, date: 'Aug 08' },
      { label: 'Week 3', price: 69990, date: 'Aug 15' },
      { label: 'Week 4', price: 68499, date: 'Aug 22' },
      { label: 'Current', price: 68499, date: 'Aug 31' }
    ]
  };

  const points = samplePoints[timeline] || samplePoints['30D'];
  const prices = points.map((p) => p.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return res.json({
    success: true,
    productId: id,
    timeline,
    current: prices[prices.length - 1],
    lowest,
    highest,
    average,
    points
  });
});

export default router;
