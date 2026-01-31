// ============================================
// server-business/routes/checkout.js
// Endpoints de Checkout (orquestación)
// ============================================

const express = require('express');
const router = express.Router();
const CheckoutService = require('../services/checkout-service');
const { authMiddleware } = require('../../shared/middleware/auth');

// Crear instancia del servicio
const createCheckoutService = (app) => {
  return new CheckoutService(
    app.locals.CRUD_API,
    app.locals.MATH_API
  );
};

/**
 * POST /api/checkout/validate
 * Validar carrito antes de procesar
 */
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const checkoutService = createCheckoutService(req.app);
    
    const result = await checkoutService.validateCart(items);
    res.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/checkout/process
 * Procesar checkout completo
 */
router.post('/process', authMiddleware, async (req, res) => {
  try {
    const { items, shippingOption, couponCode } = req.body;
    const userId = req.user._id || req.user.id;

    console.log(`[CHECKOUT] Processing for user: ${userId}`);

    const checkoutService = createCheckoutService(req.app);
    
    const result = await checkoutService.processCheckout({
      userId,
      items,
      shippingOption: shippingOption || 'standard',
      couponCode
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/checkout/user/:userId
 * Obtener historial de compras + totales generales (delegado a CRUD)
 */
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    // Esta operación es pura lectura, delegamos al CRUD_API
    const axios = require('axios');
    const response = await axios.get(
      `${req.app.locals.CRUD_API}/api/checkout/${req.params.userId}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

module.exports = router;
