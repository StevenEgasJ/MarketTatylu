// server-math/routes/reports.js
const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');

// GET /api/reports/financial
router.get('/financial', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const pipeline = [
      {
        $match: { fecha: { $gte: start, $lte: end } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$resumen.total' },
          totalSubtotal: { $sum: '$resumen.subtotal' },
          totalTax: { $sum: '$resumen.iva' },
          totalShipping: { $sum: '$resumen.envio' },
          totalDiscount: { $sum: '$resumen.descuento' },
          totalOrders: { $sum: 1 },
          avgOrder: { $avg: '$resumen.total' }
        }
      }
    ];

    const [report] = await Order.aggregate(pipeline);

    res.json({
      period: { start, end },
      report: report || {
        totalRevenue: 0,
        totalSubtotal: 0,
        totalTax: 0,
        totalShipping: 0,
        totalDiscount: 0,
        totalOrders: 0,
        avgOrder: 0
      }
    });
  } catch (error) {
    console.error('Financial report error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
