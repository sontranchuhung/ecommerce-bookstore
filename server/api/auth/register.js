const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const router = express.Router();

const uri = process.env.MONGODB_URI;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

router.post('/', async (req, res) => {
  try {
    console.log('Received register request:', req.body);

    const { email, password } = req.body;

    // Validate email and password (basic validation)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    console.log('Connected to the database');

    const db = client.db('bookstore_dtb');
    const credentialCollection = db.collection('users');

    // Check if the user already exists
    const existingUser = await credentialCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      await client.close();
      return res.status(409).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    await credentialCollection.insertOne({ email, hashedPassword, salt });

    await client.close();

    console.log('User registered successfully:', email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
