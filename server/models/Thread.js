const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isAccepted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  unreadFor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Thread", ThreadSchema);
