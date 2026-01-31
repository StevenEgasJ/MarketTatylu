// server-math/routes/calculations.js
const express = require('express');
const router = express.Router();
const User = require('../../shared/models/User');

// POST /api/calculations/loyalty-points
router.post('/loyalty-points', async (req, res) => {
  try {
    const { userId, orderTotal } = req.body;
    
    // 1 punto por cada $1
    const points = Math.floor(orderTotal);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    // Determine tier
    let newTier = 'BRONZE';
    if (user.loyaltyPoints >= 5000) newTier = 'PLATINUM';
    else if (user.loyaltyPoints >= 1000) newTier = 'GOLD';
    else if (user.loyaltyPoints >= 500) newTier = 'SILVER';

    if (newTier !== user.loyaltyTier) {
      await User.findByIdAndUpdate(userId, { loyaltyTier: newTier });
    }

    res.json({
      points,
      totalPoints: user.loyaltyPoints + points,
      newTier,
      tier: newTier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
