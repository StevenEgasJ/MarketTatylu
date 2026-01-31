// server-crud/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../../shared/models/Product');
const { authMiddleware } = require('../../shared/middleware/auth');

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50, skip = 0 } = req.query;
    const query = category ? { categoria: category } : {};
    
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ fechaCreacion: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({ products, total });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user is admin (you can add this validation)
    const product = new Product(req.body);
    const saved = await product.save();
    
    res.status(201).json(saved);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const update = { ...req.body, fechaModificacion: new Date() };
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, product: deleted });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
