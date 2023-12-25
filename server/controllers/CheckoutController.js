const express = require("express");
const bodyParser = require('body-parser');

require('dotenv').config();

const router = express.Router();
router.use(bodyParser.json());

const mongoose = require('mongoose');
const db = mongoose.connection;
const Commerce = require('@chec/commerce.js');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const commerce = new Commerce(process.env.CHEC_SECRET, true);

router.post('/create-checkout-token', async (req, res) => {
  const { cartId } = req.body;
  try {
    const token = await commerce.checkout.generateToken(cartId, { type: 'cart' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ['card'],
    });
    console.log("Created paymentIntent clientSecret:", paymentIntent.client_secret);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to handle webhooks
router.post('/webhook', (req, res) => {
  // Handle incoming webhook events from Stripe
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log('PaymentIntent failed!', paymentFailedIntent);
      // Handle failed payment
      break;
    // Add more event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});


module.exports = router;
