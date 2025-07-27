const express = require("express");
const Thread = require("../models/Thread");
const Message = require("../models/Message");
const User = require("../models/User");

module.exports = (io) => {
  const router = express.Router();

  // === Initiate chat with a user ===

  router.post("/get-or-create-thread", async (req, res) => {
    const { senderId, recipientId } = req.body;

    try {
      let thread = await Thread.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (!thread) {
        thread = new Thread({
          participants: [senderId, recipientId],
          isAccepted: false,
          unreadFor: recipientId,
        });
        await thread.save();
      }

      res.json({ threadId: thread._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // === Get all threads ===
  router.get("/threads/:userId", async (req, res) => {
    try {
      const threads = await Thread.find({ participants: req.params.userId })
        .sort({ lastUpdated: -1 })
        .populate("participants", "username profileImageUrl");

      console.log("📡 Populated Threads:", JSON.stringify(threads, null, 2));
      res.json(threads);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // === Get all messages in a thread ===
  router.get("/message/:threadId", async (req, res) => {
    try {
      const messages = await Message.find({
        threadId: req.params.threadId,
      }).sort({ createdAt: 1 });
      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // === Get unread message count for a user ===
  router.get("/unread/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const userThreadIds = await Thread.find({
        participants: userId,
      }).distinct("_id");
      const count = await Message.countDocuments({
        read: false,
        sender: { $ne: userId },
        threadId: { $in: userThreadIds },
      });

      res.json({ unreadCount: count });
    } catch (err) {
      console.error("❌ Error getting unread messages:", err);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  // === Mark all messages as read for a user ===
  router.post("/mark-all-read/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const threadIds = await Thread.find({ participants: userId }).distinct(
        "_id",
      );

      await Message.updateMany(
        {
          read: false,
          sender: { $ne: userId },
          threadId: { $in: threadIds },
        },
        { $set: { read: true } },
      );

      res.json({ success: true });
    } catch (err) {
      console.error("❌ Error marking messages read:", err);
      res.status(500).json({ error: "Failed to mark messages read" });
    }
  });

  // === Send a new message ===
  router.post("/message", async (req, res) => {
    const { sender, content, threadId } = req.body;

    try {
      const thread = await Thread.findById(threadId);
      if (!thread) return res.status(404).json({ error: "Thread not found" });

      thread.lastUpdated = new Date();
      thread.unreadFor = thread.participants.find(
        (p) => p.toString() !== sender,
      );
      await thread.save();

      const message = new Message({
        threadId,
        sender,
        content,
      });

      await message.save();

      // broadcasts message to all clients in real-time
      io.emit("receiveMessage", {
        _id: message._id,
        threadId: message.threadId,
        sender: message.sender,
        content: message.content,
        timestamp: message.timestamp,
      });

      res.json(message);
    } catch (err) {
      console.error("❌ Message send error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
