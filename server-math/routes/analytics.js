// server-math/routes/analytics.js
const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');

// GET /api/analytics/sales-summary
router.get('/sales-summary', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const pipeline = [
      {
        $match: {
          fecha: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
          totalVentas: { $sum: '$resumen.total' },
          cantidadOrdenes: { $sum: 1 },
          totalItems: { $sum: '$resumen.itemCount' }
        }
      },
      { $sort: { _id: -1 } }
    ];

    const summary = await Order.aggregate(pipeline);

    res.json({
      period: { start, end },
      data: summary,
      totalRevenue: summary.reduce((sum, s) => sum + s.totalVentas, 0),
      totalOrders: summary.reduce((sum, s) => sum + s.cantidadOrdenes, 0)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/top-products
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: { fecha: { $gte: startDate } }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          nombreProducto: { $first: '$items.nombre' },
          cantidadVendida: { $sum: '$items.cantidad' },
          ingresoTotal: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: parseInt(limit) }
    ];

    const topProducts = await Order.aggregate(pipeline);

    res.json({ topProducts, days });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
