// ============================================
// server-crud/server.js
// Servidor especializado en CRUD básico
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');

// Import middleware
const { authMiddleware } = require('../shared/middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.set('trust proxy', true);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markettatylu';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ [CRUD] Connected to MongoDB'))
  .catch(err => console.error('❌ [CRUD] MongoDB connection error:', err));

// Routes - CRUD Operations Only
app.use('/api/auth', authRouter);           // Authentication (basic)
app.use('/api/products', productsRouter);   // Products CRUD
app.use('/api/users', usersRouter);         // Users CRUD
app.use('/api/categories', categoriesRouter); // Categories CRUD
app.use('/api/reviews', reviewsRouter);     // Reviews CRUD

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'crud-api',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 [CRUD] Server running on port ${PORT}`);
  console.log('📍 Routes: /api/products, /api/users, /api/categories, /api/reviews, /api/auth');
});
