// server-business/routes/checkout.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../../shared/models/Order');
const { authMiddleware } = require('../../shared/middleware/auth');

// POST /api/checkout/validate
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.json({ valid: false, error: 'Cart is empty' });
    }

    // Get products from CRUD API
    const productIds = items.map(i => i.productId).join(',');
    const productsRes = await axios.get(`${req.app.locals.CRUD_API}/api/products?ids=${productIds}`);
    const products = productsRes.data.products || [];

    // Validate stock
    for (const item of items) {
      const product = products.find(p => p._id === item.productId);
      if (!product) {
        return res.json({ valid: false, error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.json({ valid: false, error: `Insufficient stock for ${product.nombre}` });
      }
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Validate error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/checkout/process
router.post('/process', authMiddleware, async (req, res) => {
  try {
    const { items, shippingOption = 'standard', couponCode } = req.body;
    const userId = req.user.id;

    console.log(`🛒 [CHECKOUT] Processing for user ${userId}`);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Empty cart' });
    }

    // 1. Get products from CRUD API
    const productIds = items.map(i => i.productId).join(',');
    const productsRes = await axios.get(`${req.app.locals.CRUD_API}/api/products?ids=${productIds}`);
    const products = productsRes.data.products || [];

    // 2. Validate stock
    for (const item of items) {
      const product = products.find(p => p._id === item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock: ${product?.nombre}` });
      }
    }

    // 3. Calculate subtotal
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p._id === item.productId);
      const itemTotal = product.precio * item.quantity;
      subtotal += itemTotal;
      return {
        productId: product._id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: item.quantity,
        subtotal: itemTotal
      };
    });

    // 4. Apply coupon if exists
    let discount = 0;
    if (couponCode) {
      discount = calculateCoupon(couponCode, subtotal);
    }

    // 5. Calculate IVA (12% Ecuador)
    const iva = (subtotal - discount) * 0.12;

    // 6. Calculate shipping
    const shippingCost = calculateShipping(subtotal, shippingOption);

    // 7. Total
    const total = subtotal - discount + iva + shippingCost;

    // 8. Create order in CRUD API
    const orderData = {
      userId,
      items: orderItems,
      resumen: { subtotal, descuento: discount, iva, envio: shippingCost, total, itemCount: items.length },
      shippingOption,
      estado: 'confirmed',
      couponCode,
      fecha: new Date()
    };

    const orderRes = await axios.post(`${req.app.locals.CRUD_API}/api/orders`, orderData);
    const orderId = orderRes.data._id;

    // 9. Update stock in CRUD API
    for (const item of items) {
      const product = products.find(p => p._id === item.productId);
      await axios.put(`${req.app.locals.CRUD_API}/api/products/${item.productId}`, {
        stock: product.stock - item.quantity
      });
    }

    // 10. Calculate loyalty points from MATH API
    let loyaltyPoints = 0;
    try {
      const mathRes = await axios.post(`${req.app.locals.MATH_API}/api/calculations/loyalty-points`, {
        userId,
        orderTotal: total
      });
      loyaltyPoints = mathRes.data.points || 0;
    } catch (err) {
      console.warn('⚠️ Could not calculate loyalty points:', err.message);
    }

    res.status(201).json({
      success: true,
      orderId,
      order: orderRes.data,
      loyaltyPoints
    });

  } catch (error) {
    console.error('❌ Checkout error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

function calculateCoupon(couponCode, subtotal) {
  const coupons = {
    'PROMO10': subtotal * 0.10,
    'PROMO20': subtotal * 0.20,
    'WELCOME5': subtotal * 0.05
  };
  return coupons[couponCode] || 0;
}

function calculateShipping(subtotal, option) {
  if (option === 'express') return 5.00;
  if (subtotal > 50) return 0;
  return 2.00;
}

module.exports = router;
