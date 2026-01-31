// server-crud/routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../../shared/models/Category');
const { authMiddleware } = require('../../shared/middleware/auth');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories
router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
