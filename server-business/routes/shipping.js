// server-business/routes/shipping.js
const express = require('express');
const router = express.Router();

// POST /api/shipping/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { subtotal, destination = 'sangolqui' } = req.body;

    let cost = 0;
    if (subtotal > 50) {
      cost = 0; // Free
    } else if (subtotal > 25) {
      cost = 2;
    } else {
      cost = 3;
    }

    res.json({ cost, subtotal, destination });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/shipping/estimate-time
router.post('/estimate-time', async (req, res) => {
  try {
    const { destination, option = 'standard' } = req.body;

    let hours = 0;
    if (option === 'express') {
      hours = 0.17; // ~10 minutos
    } else {
      hours = 4; // 4 horas
    }

    const estimatedDate = new Date(Date.now() + hours * 60 * 60 * 1000);

    res.json({
      option,
      estimatedHours: hours,
      estimatedDate,
      destination
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
