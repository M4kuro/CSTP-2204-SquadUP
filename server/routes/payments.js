const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const { proId, day, hour, yearMonth } = req.body;
  console.log('📥 Received booking request:', { proId, day, hour, yearMonth });

  // ✅ SAFEGUARD: Ensure all values are present
  if (!proId || !day || !hour || !yearMonth) {
    return res.status(400).json({ error: 'Missing booking data' });
  }

  // ✅ Combine yearMonth and day to get fullDate
  const fullDate = `${yearMonth}-${day}`; // e.g., "2025-07-10"
  const dateParts = fullDate.split('-');  // ["2025", "07", "10"]

  if (dateParts.length !== 3) {
    return res.status(400).json({ error: 'Invalid fullDate format' });
  }

  const justDay = dateParts[2]; // "10"

  try {
    const clientId = req.user.id;
    const clientEmail = req.user.email;

    const proUser = await User.findById(proId);
    if (!proUser || !proUser.hourlyRate) {
      return res.status(404).json({ message: 'Pro user not found or missing rate' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Session with ${proUser.username}`,
          },
          unit_amount: proUser.hourlyRate * 100, // Stripe expects cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/booking-success?proId=${proId}&yearMonth=${yearMonth}&day=${justDay}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancel`,
      payment_intent_data: {
        metadata: {
          clientId,
          clientEmail,
          proId,
          day: fullDate,  // ✅ use full date like "2025-07-10"
          hour,
        },
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

module.exports = router;
