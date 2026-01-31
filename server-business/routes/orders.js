// server-business/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../../shared/models/Order');
const { authMiddleware } = require('../../shared/middleware/auth');

// GET /api/orders/business - Get user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ fecha: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/business/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/orders/business/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { estado } = req.body;
    const validStates = ['pending_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
