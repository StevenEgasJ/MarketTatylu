// server-business/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.set('trust proxy', true);

// Service URLs
const CRUD_API = process.env.CRUD_API || 'http://localhost:3001';
const MATH_API = process.env.MATH_API || 'http://localhost:3003';

console.log(`📍 CRUD_API: ${CRUD_API}`);
console.log(`📍 MATH_API: ${MATH_API}`);

app.locals.CRUD_API = CRUD_API;
app.locals.MATH_API = MATH_API;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markettatylu';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ [BUSINESS] Connected to MongoDB'))
  .catch(err => console.error('❌ [BUSINESS] MongoDB connection error:', err));

// Routes
const checkoutRouter = require('./routes/checkout');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const loyaltyRouter = require('./routes/loyalty');
const shippingRouter = require('./routes/shipping');

app.use('/api/checkout', checkoutRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders/business', ordersRouter);
app.use('/api/loyalty', loyaltyRouter);
app.use('/api/shipping', shippingRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'business-api',
    status: 'running',
    port: process.env.PORT || 3002,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dependencies: { crud_api: CRUD_API, math_api: MATH_API }
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 [BUSINESS] Server running on port ${PORT}`);
  console.log('📍 Routes: /api/checkout, /api/cart, /api/orders/business, /api/loyalty, /api/shipping');
});

module.exports = app;
