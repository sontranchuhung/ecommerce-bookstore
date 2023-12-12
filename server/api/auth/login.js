const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const router = express.Router();

const uri = process.env.MONGODB_URI;

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db('bookstore_dtb');
    const credentialCollection = db.collection('users');

    const user = await credentialCollection.findOne({ email });

    if (!user) {
      await client.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword); // Fix: Use `password` instead of `res.body.password`

    if (!passwordMatch) {
      console.error(`Password not matched. User password: ${user.hashedPassword}, Entered password: ${password}`);
      await client.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await client.close();

    // Return the token in the response
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
