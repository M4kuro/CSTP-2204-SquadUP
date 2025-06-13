const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  interests: [String],
  location: {
    lat: Number,
    lng: Number,
  },
  squadRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);

