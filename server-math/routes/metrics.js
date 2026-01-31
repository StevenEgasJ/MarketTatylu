// server-math/routes/metrics.js
const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');
const User = require('../../shared/models/User');

// GET /api/metrics/conversion
router.get('/conversion', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalUsers = await User.countDocuments({ fechaRegistro: { $gte: start } });
    const conversions = await Order.countDocuments({ fecha: { $gte: start } });

    const rate = totalUsers > 0 ? (conversions / totalUsers * 100).toFixed(2) : 0;

    res.json({
      days,
      totalUsers,
      conversions,
      conversionRate: parseFloat(rate),
      conversionRatePercentage: `${rate}%`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/metrics/retention
router.get('/retention', async (req, res) => {
  try {
    const usersWithOrders = await Order.distinct('userId');
    const totalUsers = await User.countDocuments();

    const retention = ((usersWithOrders.length / totalUsers) * 100).toFixed(2);

    res.json({
      totalUsers,
      activeUsers: usersWithOrders.length,
      retentionRate: parseFloat(retention),
      retentionPercentage: `${retention}%`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
