const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { userId, priceId } = req.body;

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Premium Subscription',
                        },
                        unit_amount: 29900, // ₹299.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // or 'subscription'
            success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
            metadata: { userId }
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
