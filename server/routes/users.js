console.log("✅ users.js loaded");

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

// GET /api/users/matches/:userId
router.get('/matches/:userId', async (req, res) => {
  console.log("✅ /matches route triggered", req.params.userId);
  try {
    const currentUser = await User.findById(req.params.userId).populate('matches');
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    res.json(currentUser.matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/users/requests/:userId
router.get('/requests/:userId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId).populate('squadRequests');
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    res.json(currentUser.squadRequests);
  } catch (err) {
    console.error('Error fetching squad requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST /api/users/:id/squadup
router.post('/:id/squadup', async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId; // You must send this in the body
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't S+UP yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if target already S+UP’ed current user
    const isMutual = targetUser.squadRequests.includes(currentUserId);

    if (isMutual) {
      // Create mutual match
      currentUser.matches.push(targetUserId);
      targetUser.matches.push(currentUserId);

      // Remove request from targetUser's pending list
      targetUser.squadRequests = targetUser.squadRequests.filter(
        (id) => id.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({ matched: true, message: "🎉 It’s a match!" });
    } else {
      // Otherwise, just add request to target
      if (!targetUser.squadRequests.includes(currentUserId)) {
        targetUser.squadRequests.push(currentUserId);
        await targetUser.save();
      }

      return res.status(200).json({ matched: false, message: "S+UP request sent." });
    }
  } catch (err) {
    console.error("S+UP error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});


module.exports = router;
