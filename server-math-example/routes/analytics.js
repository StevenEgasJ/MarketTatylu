// ============================================
// server-math/routes/analytics.js
// Endpoints de Analytics (operaciones matemáticas)
// ============================================

const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');
const Product = require('../../shared/models/Product');

/**
 * GET /api/analytics/sales-summary
 * Resumen de ventas por período
 */
router.get('/sales-summary', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const pipeline = [
      {
        $match: {
          fecha: {
            $gte: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
            $lte: new Date(endDate || Date.now())
          }
        }
      },
      {
        $group: {
          _id: `$${groupBy === 'month' ? 'mes' : 'fecha'}`,
          totalVentas: { $sum: '$resumen.total' },
          totalItems: { $sum: '$resumen.itemCount' },
          cantidadOrdenes: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ];

    const summary = await Order.aggregate(pipeline);

    res.json({
      period: { startDate, endDate, groupBy },
      data: summary,
      totalRevenue: summary.reduce((sum, row) => sum + row.totalVentas, 0),
      totalOrders: summary.reduce((sum, row) => sum + row.cantidadOrdenes, 0)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/top-products
 * Productos más vendidos
 */
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    const pipeline = [
      {
        $match: {
          fecha: {
            $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          nombreProducto: { $first: '$items.nombre' },
          cantidadVendida: { $sum: '$items.cantidad' },
          ingresoTotal: { $sum: '$items.subtotal' },
          promedioVenta: { $avg: '$items.precio' }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: parseInt(limit) }
    ];

    const topProducts = await Order.aggregate(pipeline);

    res.json({
      period: `Last ${days} days`,
      topProducts,
      summary: {
        totalProductsSold: topProducts.reduce((s, p) => s + p.cantidadVendida, 0),
        totalRevenue: topProducts.reduce((s, p) => s + p.ingresoTotal, 0)
      }
    });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/user-segmentation
 * Segmentación de clientes (RFM: Recency, Frequency, Monetary)
 */
router.get('/user-segmentation', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$resumen.total' },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: '$fecha' },
          avgOrderValue: { $avg: '$resumen.total' }
        }
      },
      {
        $project: {
          userId: '$_id',
          totalSpent: 1,
          orderCount: 1,
          lastOrderDate: 1,
          avgOrderValue: 1,
          // Calcular días desde última compra
          daysSinceLastOrder: {
            $divide: [
              { $subtract: [new Date(), '$lastOrderDate'] },
              1000 * 60 * 60 * 24
            ]
          },
          // Segmento según gasto total
          segment: {
            $cond: [
              { $gte: ['$totalSpent', 1000] },
              'VIP',
              {
                $cond: [
                  { $gte: ['$totalSpent', 500] },
                  'PREMIUM',
                  'STANDARD'
                ]
              }
            ]
          }
        }
      },
      { $sort: { totalSpent: -1 } }
    ];

    const segmentation = await Order.aggregate(pipeline);

    // Agrupar por segmento
    const bySegment = {
      VIP: segmentation.filter(s => s.segment === 'VIP'),
      PREMIUM: segmentation.filter(s => s.segment === 'PREMIUM'),
      STANDARD: segmentation.filter(s => s.segment === 'STANDARD')
    };

    res.json({
      totalCustomers: segmentation.length,
      segmentation: bySegment,
      metrics: {
        avgSpendVIP: bySegment.VIP.length > 0
          ? bySegment.VIP.reduce((s, u) => s + u.totalSpent, 0) / bySegment.VIP.length
          : 0
      }
    });
  } catch (error) {
    console.error('Segmentation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/revenue-forecast
 * Proyección de ingresos (usando tendencia simple)
 */
router.get('/revenue-forecast', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Obtener últimos 60 días de datos
    const orders = await Order.find({
      fecha: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    }).lean();

    // Agrupar por día
    const dailyRevenue = {};
    orders.forEach(order => {
      const date = new Date(order.fecha).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.resumen.total;
    });

    // Calcular promedio diario
    const revenues = Object.values(dailyRevenue);
    const avgDaily = revenues.reduce((a, b) => a + b, 0) / revenues.length;

    // Proyectar
    const forecast = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      forecast.push({
        date: date.toISOString().split('T')[0],
        projectedRevenue: avgDaily * (1 + Math.random() * 0.1) // ±10% variación
      });
    }

    res.json({
      period: `${days} days forecast`,
      avgDailyRevenue: avgDaily,
      forecast,
      assumptions: 'Linear trend with 10% variance'
    });
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
