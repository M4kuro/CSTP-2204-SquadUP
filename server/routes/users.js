console.log("✅ users.js loaded");
// const multer = require("multer");  // testing cloudinary
// const path = require("path");  // testing cloudinary
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const { authenticateToken } = require("../middleware/auth"); // Had to move it.
const Thread = require("../models/Thread");  // wanting to remove threads and messages on unsquad
const Message = require("../models/Message"); // wanting to remove threads and messages on unsquad

// Storage settings ==============================================  testing cloudinary so commening this out.
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// Upload route (for uploading images) ========================================================testing cloudinary so commening this out.
// router.post(
//   "/me/upload",
//   authenticateToken,
//   upload.fields([
//     { name: "main", maxCount: 1 },
//     { name: "other0", maxCount: 1 },
//     { name: "other1", maxCount: 1 },
//     { name: "other2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const user = await User.findById(req.user.id);
//       if (!user) return res.status(404).json({ error: "User not found" });

//       if (req.files["main"]) {
//         user.profileImageUrl = req.files["main"][0].filename;
//       }

//       const others = [];
//       ["other0", "other1", "other2"].forEach((key) => {
//         if (req.files[key]) {
//           others.push(req.files[key][0].filename);
//         } else {
//           others.push(null);
//         }
//       });

//       user.otherImages = others;
//       await user.save();

//       res.json({
//         profileImageUrl: user.profileImageUrl,
//         otherImages: user.otherImages,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Image upload failed" });
//     }
//   },
// );

// GET /api/users/discover  =========================================================
router.get("/discover", async (req, res) => {
  try {
    const allUsers = await User.find();
    const shuffled = allUsers.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, 50);
    res.json(limited);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/matches/:userId ========================================================
router.get("/matches/:userId", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const currentUser = await User.findById(req.params.userId).populate(
      "matches",
    );
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // deduplicate matches based on _id  ** incase of duplicates this prevents it.
    const uniqueMatches = currentUser.matches.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u._id.toString() === user._id.toString())
    );

    res.json(uniqueMatches);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/requests/:userId =======================================================
router.get("/requests/:userId", authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: "Unauthorized request" });
  }
  try {
    const currentUser = await User.findById(req.params.userId).populate(
      "squadRequests",
    );
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    res.json(currentUser.squadRequests);
  } catch (err) {
    console.error("Error fetching squad requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/:id - update profile ======================================================
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true },
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/users/:id/rate  this is for giving a rating to someone

router.post("/:id/rate", authenticateToken, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const userId = req.user.id;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const alreadyRated = targetUser.ratings.find((r) => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "You already rated this user." });
    }

    targetUser.ratings.push({ userId, stars, comment });
    await targetUser.save();

    res.status(200).json({ message: "Rating submitted!" });
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/users/:id/squadup (ACCEPT REQUEST) ===============================================
router.post("/:id/squadup", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id; // updated this because JWT after authentication middleware
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't S+UP yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }
    // flipping this part around from targetuser to current user
    const isMutual = currentUser.squadRequests.includes(targetUserId);

    if (isMutual) {
      // only add if not already matched
      if (!currentUser.matches.includes(targetUserId)) {
        currentUser.matches.push(targetUserId);
      }

      if (!targetUser.matches.includes(currentUserId)) {
        targetUser.matches.push(currentUserId);
      }
      // always remove the pending request
      currentUser.squadRequests = currentUser.squadRequests.filter(
        (id) => id.toString() !== targetUserId,
      );

      await currentUser.save();
      await targetUser.save();

      return res
        .status(200)
        .json({ matched: true, message: "🎉 It’s a match!" });
    } else {
      // no mutual match yet — just send request
      if (!targetUser.squadRequests.includes(currentUserId)) {
        targetUser.squadRequests.push(currentUserId);
        await targetUser.save();
      }

      return res
        .status(200)
        .json({ matched: false, message: "S+UP request sent." });
    }
  } catch (err) {
    console.error("S+UP error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// POST /api/users/:id/decline (DECLINE REQUEST )===============================================
router.post("/:id/decline", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const { requesterId } = req.body;

    if (req.user.id !== currentUserId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!requesterId) {
      return res.status(400).json({ error: "Missing requester ID" });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    currentUser.squadRequests = currentUser.squadRequests.filter(
      (id) => id.toString() !== requesterId,
    );

    await currentUser.save();

    res.status(200).json({ message: "Request declined." });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/users/:id/unsquad   --- the unsquadup (after matching)
router.post("/:id/unsquad", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // removes matches
    currentUser.matches = currentUser.matches.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.matches = targetUser.matches.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    // deletes threads and messages on unsquadding.
    const thread = await Thread.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (thread) {
      await Message.deleteMany({ threadId: thread._id });
      await Thread.deleteOne({ _id: thread._id });
    }

    return res.status(200).json({ message: "You have unsquaded and chat was deleted." });
  } catch (err) {
    console.error("❌ Unsquad error:", err);
    res.status(500).json({ error: "Failed to unsquad." });
  }
});

// This section and below should not be moved.

// 🔐 Secure route to get current user using JWT
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // id from JWT
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ MOVED THIS ROUTE TO THE VERY END
// GET /api/users/:userId - fetch user profile by ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
