const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticateToken } = require('../middleware/auth'); // our auth middleware

// POST /api/bookings - create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { proId, day, hour } = req.body;
    const userId = req.user.id; // assuming the auth middleware works here

    // prevents double booking
    const existing = await Booking.findOne({ proId, day, hour });
    if (existing) {
      return res.status(409).json({ message: 'This slot is already booked.' });
    }

    const booking = new Booking({ userId, proId, day, hour });
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error while booking.' });
  }
});

// GET /api/bookings/:proId/:day - fetches the booked slots for a pro on a given day
router.get('/:proId/:day', async (req, res) => {
  try {
    const { proId, day } = req.params;
    const bookings = await Booking.find({ proId, day });
    const bookedHours = bookings.map((b) => b.hour);

    res.json({ bookedHours });
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ message: 'Error fetching booked times.' });
  }
});

module.exports = router;