// server-math/routes/predictions.js
const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');

// POST /api/predictions/churn-risk
router.post('/churn-risk', async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ userId }).sort({ fecha: -1 }).limit(10);

    if (orders.length === 0) {
      return res.json({ userId, riskLevel: 'high', reason: 'No purchase history' });
    }

    const lastOrder = orders[0];
    const daysSinceLastOrder = Math.floor((Date.now() - lastOrder.fecha) / (1000 * 60 * 60 * 24));

    let riskLevel = 'low';
    if (daysSinceLastOrder > 90) riskLevel = 'high';
    else if (daysSinceLastOrder > 30) riskLevel = 'medium';

    res.json({
      userId,
      riskLevel,
      daysSinceLastOrder,
      lastOrderDate: lastOrder.fecha,
      orderCount: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
