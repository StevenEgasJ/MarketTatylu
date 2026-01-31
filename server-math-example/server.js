// ============================================
// server-math/server.js
// Servidor especializado en Operaciones Matemáticas
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const analyticsRouter = require('./routes/analytics');
const reportsRouter = require('./routes/reports');
const calculationsRouter = require('./routes/calculations');
const predictionsRouter = require('./routes/predictions');
const metricsRouter = require('./routes/metrics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.set('trust proxy', true);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markettatylu';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ [MATH] Connected to MongoDB'))
  .catch(err => console.error('❌ [MATH] MongoDB connection error:', err));

// Routes - Math & Analytics Only
app.use('/api/analytics', analyticsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/calculations', calculationsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/metrics', metricsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'math-engine',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 [MATH] Server running on port ${PORT}`);
  console.log('📍 Routes: /api/analytics, /api/reports, /api/calculations, /api/predictions, /api/metrics');
});
