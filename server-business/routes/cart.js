// server-business/routes/cart.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authMiddleware } = require('../../shared/middleware/auth');

// POST /api/cart/calculate-totals
router.post('/calculate-totals', async (req, res) => {
  try {
    const { items, shippingOption = 'standard' } = req.body;

    if (!items || items.length === 0) {
      return res.json({ subtotal: 0, iva: 0, envio: 0, total: 0 });
    }

    // Get products
    const productIds = items.map(i => i.productId).join(',');
    const productsRes = await axios.get(`${req.app.locals.CRUD_API}/api/products?ids=${productIds}`);
    const products = productsRes.data.products || [];

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const product = products.find(p => p._id === item.productId);
      if (product) {
        subtotal += product.precio * item.quantity;
      }
    }

    // Calculate shipping
    const envio = calculateShipping(subtotal, shippingOption);

    // Calculate IVA
    const iva = subtotal * 0.12;

    const total = subtotal + iva + envio;

    res.json({ subtotal, iva, envio, total });
  } catch (error) {
    console.error('Calculate totals error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart/apply-coupon
router.post('/apply-coupon', authMiddleware, async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body;

    const discount = calculateCoupon(couponCode, subtotal);

    res.json({ couponCode, discount, isValid: discount > 0 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function calculateShipping(subtotal, option) {
  if (option === 'express') return 5.00;
  if (subtotal > 50) return 0;
  return 2.00;
}

function calculateCoupon(couponCode, subtotal) {
  const coupons = {
    'PROMO10': subtotal * 0.10,
    'PROMO20': subtotal * 0.20,
    'WELCOME5': subtotal * 0.05
  };
  return coupons[couponCode] || 0;
}

module.exports = router;
