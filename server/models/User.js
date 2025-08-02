const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImageUrl: String,
  otherImages: [String],
  password: { type: String, required: true },
  interests: [String],
  location: {
    lat: Number,
    lng: Number,
  },
  bio: { type: String },
  birthdate: { type: Date },
  height: { type: String },
  weight: { type: String },
  isPro: { type: Boolean, default: false },
  hourlyRate: {
    type: Number, required: function () {
      return this.isPro;
    },
    min: [1, "Hourly rate must be at least $1"]
  },
  ratings: [
    {
      userId: String,
      stars: Number, // from 1 to 5
      comment: String,
    },
  ],
  proDescription: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  x: { type: String },
  bluesky: { type: String },
  squadRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
