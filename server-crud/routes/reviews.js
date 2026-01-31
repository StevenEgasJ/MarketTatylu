// server-crud/routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../../shared/models/Review');
const { authMiddleware } = require('../../shared/middleware/auth');

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const { productId, limit = 20 } = req.query;
    const query = productId ? { productId } : {};
    
    const reviews = await Review.find(query)
      .limit(parseInt(limit))
      .sort({ fecha: -1 })
      .populate('userId', 'nombre');
    
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews
router.post('/', authMiddleware, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      userId: req.user.id
    });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
