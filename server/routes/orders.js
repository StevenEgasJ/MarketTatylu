const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// NOTE: Auth removed intentionally so orders APIs can be used without authentication
// GET /api/orders - list recent orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ fecha: -1 }).limit(200).lean();
    res.json(orders);
  } catch (err) {
    console.error('Error listing orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// POST /api/orders/calculate - calculate order price breakdown
router.post('/calculate', async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: 'No items provided' });

    // Fetch product info for items that provide productId
    const productIds = items.filter(i => i.productId).map(i => i.productId);
    const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).lean() : [];
    const prodMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

    let subtotal = 0;
    let discountTotal = 0;

    const computedItems = items.map(it => {
      const qty = Number(it.cantidad || it.quantity || 0);
      let unitPrice = it.precio != null ? Number(it.precio) : 0;
      let nombre = it.nombre || it.name || '';
      let descuento = 0;

      if (it.productId && prodMap[it.productId]) {
        const p = prodMap[it.productId];
        nombre = nombre || p.nombre;
        unitPrice = p.precio;
        descuento = Number(p.descuento || 0);
      }

      const priceAfterDiscount = +(unitPrice * (1 - (descuento / 100)));
      const lineTotal = +(priceAfterDiscount * qty);
      subtotal += lineTotal;
      discountTotal += +( (unitPrice - priceAfterDiscount) * qty );

      return {
        productId: it.productId,
        nombre,
        precioUnit: +unitPrice.toFixed(2),
        descuento: +descuento.toFixed(2),
        precioConDescuento: +priceAfterDiscount.toFixed(2),
        cantidad: qty,
        total: +lineTotal.toFixed(2)
      };
    });

    const taxRate = Number(req.body.taxRate ?? process.env.DEFAULT_TAX_RATE ?? 0);
    const taxes = +(subtotal * taxRate);
    const total = +(subtotal + taxes).toFixed(2);

    const resumen = {
      subtotal: +subtotal.toFixed(2),
      discountTotal: +discountTotal.toFixed(2),
      taxRate: +taxRate,
      taxes: +taxes.toFixed(2),
      total: +total,
      items: computedItems
    };

    res.json({ resumen });
  } catch (err) {
    console.error('Error calculating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders - create and save order with computed resumen if needed
router.post('/', async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: 'No items provided' });

    // Compute resumen if not provided
    let resumen = req.body.resumen;
    if (!resumen) {
      // reuse local calculation logic
      const calcReq = { body: { items, taxRate: req.body.taxRate } };
      // directly call calculation logic to avoid HTTP overhead
      const fakeReq = { body: { items, taxRate: req.body.taxRate } };
      const fakeRes = {
        jsonPayload: null,
        json(obj) { this.jsonPayload = obj; }
      };
      // call calculation handler functionally
      await (async function calculateInline() {
        const productIds = items.filter(i => i.productId).map(i => i.productId);
        const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).lean() : [];
        const prodMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

        let subtotal = 0;
        let discountTotal = 0;

        const computedItems = items.map(it => {
          const qty = Number(it.cantidad || it.quantity || 0);
          let unitPrice = it.precio != null ? Number(it.precio) : 0;
          let nombre = it.nombre || it.name || '';
          let descuento = 0;

          if (it.productId && prodMap[it.productId]) {
            const p = prodMap[it.productId];
            nombre = nombre || p.nombre;
            unitPrice = p.precio;
            descuento = Number(p.descuento || 0);
          }

          const priceAfterDiscount = +(unitPrice * (1 - (descuento / 100)));
          const lineTotal = +(priceAfterDiscount * qty);
          subtotal += lineTotal;
          discountTotal += +( (unitPrice - priceAfterDiscount) * qty );

          return {
            productId: it.productId,
            nombre,
            precioUnit: +unitPrice.toFixed(2),
            descuento: +descuento.toFixed(2),
            precioConDescuento: +priceAfterDiscount.toFixed(2),
            cantidad: qty,
            total: +lineTotal.toFixed(2)
          };
        });

        const taxRate = Number(req.body.taxRate ?? process.env.DEFAULT_TAX_RATE ?? 0);
        const taxes = +(subtotal * taxRate);
        const total = +(subtotal + taxes).toFixed(2);

        resumen = {
          subtotal: +subtotal.toFixed(2),
          discountTotal: +discountTotal.toFixed(2),
          taxRate: +taxRate,
          taxes: +taxes.toFixed(2),
          total: +total,
          items: computedItems
        };
      })();
    }

    const orderPayload = {
      items,
      resumen,
      estado: req.body.estado || 'pendiente',
      userId: req.body.userId
    };

    const order = new Order(orderPayload);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/top?limit=10 - return top orders by total amount
router.get('/top', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const orders = await Order.find().lean();

    const computeTotal = o => {
      if (o.resumen && typeof o.resumen.total === 'number') return o.resumen.total;
      // fallback: sum item totals if present
      if (Array.isArray(o.items) && o.items.length) {
        return o.items.reduce((s, it) => s + (Number(it.total) || 0), 0);
      }
      return 0;
    };

    const sorted = orders.map(o => ({ ...o, computedTotal: computeTotal(o) }))
                         .sort((a, b) => b.computedTotal - a.computedTotal)
                         .slice(0, limit);
    res.json(sorted);
  } catch (err) {
    console.error('Error fetching top orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Small fetch helper that falls back to node-fetch when running on older Node versions
const doFetch = (...args) => {
  if (global.fetch) return global.fetch(...args);
  try {
    return require('node-fetch')(...args);
  } catch (err) {
    throw new Error('Fetch is not available and node-fetch is not installed. Please run on Node >=18 or install node-fetch.');
  }
};

// POST /api/orders/microservice-create - demonstrates an API that calls other APIs
// It calls /api/orders/calculate and then /api/orders to persist
router.post('/microservice-create', async (req, res) => {
  try {
    const port = process.env.PORT || 4000;
    const baseUrl = `http://localhost:${port}`;
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ error: 'No items provided' });

    // call calculate API
    const calcResp = await doFetch(`${baseUrl}/api/orders/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, taxRate: req.body.taxRate })
    });
    if (!calcResp.ok) {
      const txt = await calcResp.text();
      return res.status(502).json({ error: 'Calculation service failed', details: txt });
    }
    const calcJson = await calcResp.json();

    // call create API with computed resumen
    const saveResp = await doFetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, resumen: calcJson.resumen, userId: req.body.userId })
    });
    if (!saveResp.ok) {
      const txt = await saveResp.text();
      return res.status(502).json({ error: 'Order save service failed', details: txt });
    }
    const saved = await saveResp.json();
    res.status(201).json({ saved, via: ['calculate', 'orders'] });
  } catch (err) {
    console.error('Error in microservice-create:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id - placed after fixed routes to avoid path conflicts
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order by id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
