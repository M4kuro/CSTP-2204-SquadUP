const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  proId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true
  },
  hour: {
    type: String, // e.g., '9 AM', '10 AM'
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
