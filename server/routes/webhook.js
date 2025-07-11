console.log('📡 Stripe webhook received!');

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking'); // mongodb booking model

// raw body for Stripe signature verification section
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // get this from the Stripe dashboard
        );
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // handle successful checkout session
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata;

        try {
            await Booking.create({  // this needs to match what we have in the schema for Booking.js
                proId: metadata.proId,
                userId: metadata.clientId,     
                date: metadata.day,            
                hour: metadata.hour,
                clientEmail: metadata.clientEmail,
                paid: true
            });
            console.log('Booking saved after successful payment.');
        } catch (err) {
            console.error('!! Failed to save booking:', err);
        }
    }

    res.status(200).json({ received: true });
});

module.exports = router;
