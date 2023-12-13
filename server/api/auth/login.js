const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { MongoClient } = require('mongodb');

const router = express.Router();
router.use(cookieParser());

const uri = process.env.MONGODB_URI;

router.post('/', async (req, res) => {
  try {
    console.log('Received login request:', req.body);

    const { email, password } = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    console.log('Connected to the database');

    const db = client.db('bookstore_dtb');
    const credentialCollection = db.collection('users');

    console.log('Searching for user with email:', email);

    const user = await credentialCollection.findOne({ email });

    if (!user) {
      console.log('User not found');
      await client.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      console.error(`Password not matched. User password: ${user.hashedPassword}, Entered password: ${password}`);
      await client.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password matched. Generating token...');

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await client.close();

    console.log('Token generated:', token);

    // Return the token in the response
    // res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ message: 'Authentication successful', token});

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
