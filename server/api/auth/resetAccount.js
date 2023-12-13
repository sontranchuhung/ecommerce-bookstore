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
  
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
  
    const salt = await bcrypt.genSalt(saltRounds);
  
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('users');
  
      const updateResult = await collection.updateOne({ email }, { $set: { hashedPassword, salt } });
  
      if (updateResult.matchedCount === 0) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send('Password reset successfully');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      await client.close();
    }
  });
  

module.exports = router;
