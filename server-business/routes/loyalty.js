// server-business/routes/loyalty.js
const express = require('express');
const router = express.Router();
const User = require('../../shared/models/User');
const { authMiddleware } = require('../../shared/middleware/auth');

// GET /api/loyalty/user/:userId
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('loyaltyPoints loyaltyTier');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
      nextTierPoints: calculateNextTierPoints(user.loyaltyTier)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/loyalty/calculate-points (internal)
router.post('/calculate-points', async (req, res) => {
  try {
    const { userId, orderTotal } = req.body;
    
    // 1 punto por cada $1 gastado
    const points = Math.floor(orderTotal);
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    // Check tier
    const newTier = determineTier(user.loyaltyPoints);
    if (newTier !== user.loyaltyTier) {
      await User.findByIdAndUpdate(userId, { loyaltyTier: newTier });
    }

    res.json({ points, newTier, totalPoints: user.loyaltyPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateNextTierPoints(currentTier) {
  const tiers = { 'BRONZE': 100, 'SILVER': 500, 'GOLD': 1000, 'PLATINUM': 5000 };
  return tiers[currentTier] || 100;
}

function determineTier(points) {
  if (points >= 5000) return 'PLATINUM';
  if (points >= 1000) return 'GOLD';
  if (points >= 500) return 'SILVER';
  return 'BRONZE';
}

module.exports = router;
