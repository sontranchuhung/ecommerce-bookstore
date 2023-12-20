const express = require("express");
const bodyParser = require('body-parser');

require('dotenv').config();

const router = express.Router();
router.use(bodyParser.json());

const mongoose = require('mongoose');
const db = mongoose.connection;
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
      
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to handle webhooks
  router.post('/webhook', (req, res) => {
    // Handle incoming webhook events from Stripe
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET);
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
  
  router.post('/process-payment', async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
      // Handle paymentIntent.status to determine the payment status
      if (paymentIntent.status === 'succeeded') {
        // Payment has succeeded, perform additional actions (e.g., store data to MongoDB)
        const { payment_method_types, amount, currency, status } = paymentIntent;
  
        // If payment_method_types is an array, use the first element as the payment method
        const paymentMethod = Array.isArray(payment_method_types) ? payment_method_types[0] : null;
  
        // Define a Mongoose schema and model for your data
        const paymentSchema = new mongoose.Schema({
          paymentMethod: String,
          amount: Number,
          currency: String,
          status: String,
        });
  
        const Payment = mongoose.model('Payment', paymentSchema);
  
        // Create a new payment document and save it to MongoDB
        const newPayment = new Payment({
          paymentMethod,
          amount,
          currency,
          status,
        });
  
        await newPayment.save();
  
        res.json({ status: 'success', message: 'Payment processed and data stored successfully' });
      } else {
        // Handle other payment statuses if needed
        res.json({ status: paymentIntent.status, message: 'Payment status not succeeded' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  module.exports = router;
