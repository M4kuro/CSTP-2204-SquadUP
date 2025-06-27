console.log("✅ users.js loaded");
const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth'); // Had to move it.


// Storage settings ==============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload route (for uploading images) ========================================================
router.post('/me/upload', authenticateToken, upload.fields([
  { name: 'main', maxCount: 1 },
  { name: 'other0', maxCount: 1 },
  { name: 'other1', maxCount: 1 },
  { name: 'other2', maxCount: 1 },
]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.files['main']) {
      user.profileImageUrl = req.files['main'][0].filename;
    }

    const others = [];
    ['other0', 'other1', 'other2'].forEach((key) => {
      if (req.files[key]) {
        others.push(req.files[key][0].filename);
      } else {
        others.push(null);
      }
    });

    user.otherImages = others;
    await user.save();

    res.json({
      profileImageUrl: user.profileImageUrl,
      otherImages: user.otherImages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// GET /api/users/discover  =========================================================
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

// GET /api/users/matches/:userId ========================================================
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

// GET /api/users/requests/:userId =======================================================
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

// PUT /api/users/:id - update profile ======================================================
router.put('/me',authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/rate  this is for giving a rating to someone

router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const userId = req.user.id;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const alreadyRated = targetUser.ratings.find(r => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: 'You already rated this user.' });
    }

    targetUser.ratings.push({ userId, stars, comment });
    await targetUser.save();

    res.status(200).json({ message: 'Rating submitted!' });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/users/:id/squadup ===============================================  
router.post('/:id/squadup', async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't S+UP yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMutual = targetUser.squadRequests.includes(currentUserId);

    if (isMutual) {
      currentUser.matches.push(targetUserId);
      targetUser.matches.push(currentUserId);
      targetUser.squadRequests = targetUser.squadRequests.filter(
        (id) => id.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({ matched: true, message: "🎉 It’s a match!" });
    } else {
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


// This section and below should not be moved.


// 🔐 Secure route to get current user using JWT
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // id from JWT
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ MOVED THIS ROUTE TO THE VERY END
// GET /api/users/:userId - fetch user profile by ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
