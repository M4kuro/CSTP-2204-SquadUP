const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/discover
router.get('/discover', async (req, res) => {
  try {
    const allUsers = await User.find();
    const shuffled = allUsers.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, 50);
    res.json(limited);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
