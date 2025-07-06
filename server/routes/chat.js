const express = require('express');
const Thread = require('../models/Thread');
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
    const router = express.Router();

    // === Initiate chat with a user ===

    router.post('/get-or-create-thread', async (req, res) => {
  const { senderId, recipientId } = req.body;

  try {
    let thread = await Thread.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!thread) {
      thread = new Thread({
        participants: [senderId, recipientId],
        isAccepted: false,
        unreadFor: recipientId
      });
      await thread.save();
    }

    res.json({ threadId: thread._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

    // === Get all threads ===
    router.get('/threads/:userId', async (req, res) => {
        try {
            const threads = await Thread.find({ participants: req.params.userId })
                .sort({ lastUpdated: -1 })
                .populate('participants', 'username profileImageUrl');

            console.log('📡 Populated Threads:', JSON.stringify(threads, null, 2));
            res.json(threads);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // === Get all messages in a thread ===
    router.get('/message/:threadId', async (req, res) => {
        try {
            const messages = await Message.find({ threadId: req.params.threadId }).sort({ createdAt: 1 });
            res.json(messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    });

    // === Send a new message ===
    router.post('/message', async (req, res) => {
        const { sender, content, threadId } = req.body;

        try {
            const thread = await Thread.findById(threadId);
            if (!thread) return res.status(404).json({ error: 'Thread not found' });

            thread.lastUpdated = new Date();
            thread.unreadFor = thread.participants.find(p => p.toString() !== sender);
            await thread.save();

            const message = new Message({
                threadId,
                sender,
                content,
            });

            await message.save();

            // broadcasts message to all clients in real-time
            io.emit('receiveMessage', {
                _id: message._id,
                threadId: message.threadId,
                sender: message.sender,
                content: message.content,
                timestamp: message.timestamp,
            });

            res.json(message);
        } catch (err) {
            console.error('❌ Message send error:', err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};