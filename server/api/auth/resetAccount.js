const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = process.env.MONGODB_URI;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Temporary store for OTPs 
const otpStore = {};

router.get('/', async (req, res) => {
  console.log('hello world');
})

// Send OPT Route
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const otp = generateOTP();
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`);

  res.status(200).send('OTP sent successfully');
});

// Verifying OTP Route
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }

  if (otpStore[email] === otp) {
    res.status(200).send('OTP verified successfully');
  } else {
    res.status(401).send('Invalid OTP');
  }
});

// Resetting account password Route
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received reset password request for email:', email);

  if (!email || !password) {
    console.log('Validation error: Email and password are required');
    return res.status(400).send('Email and password are required');
  }

  const salt = await bcrypt.genSalt(saltRounds);

  console.log('Generated salt for password hashing');

  try {
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hashed password:', hashedPassword);

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('users');

      const updateResult = await collection.updateOne({ email }, { $set: { hashedPassword, salt } });

      if (updateResult.matchedCount === 0) {
        console.log('User not found');
        res.status(404).send('User not found');
      } else {
        console.log('Password reset successfully');
        res.status(200).send('Password reset successfully');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      await client.close();
    }
  } catch (hashError) {
    console.error('Error hashing password:', hashError);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
