// controllers/AuthController.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;

router.post('/login', async (req, res) => {
    try {
        console.log('Received login request:', req.body);

        const { email, password } = req.body;



        const db = mongoose.connection;

        console.log('Searching for user with email:', email);

        const credentialCollection = db.collection('users');

        const user = await credentialCollection.findOne({ email });

        if (!user) {
            console.log('User not found');
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

        console.log('Token generated:', token);

        // Return the token in the response
        // res.cookie('token', token, { httpOnly: true });

        res.status(200).json({ message: 'Authentication successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/loginToken', async (req, res) => {
    console.log('validateLoginToken triggered');

    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        console.log('401: No token provided');
        return res.status(401).json({ isValid: false, error: 'No token provided' });
    }

    const token = authorizationHeader.substring('Bearer '.length);

    console.log(`validateLoginToken received from client: ${token}`);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('200: Token is valid');

        // Cac chuc nang khac de check 

        return res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Error during token validation:', error);

        if (error.name === 'TokenExpiredError') {
            // Handle token expiration
            return res.status(401).json({ isValid: false, error: 'Token has expired' });
        }

        // Handle other verification errors
        return res.status(401).json({ isValid: false, error: 'Invalid token' });
    }
});

router.post('/register', async (req, res) => {
    try {
        console.log('Received register request:', req.body);

        const { email, password } = req.body;

        // Validate email and password (basic validation)
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Use the existing Mongoose connection
        const db = mongoose.connection;

        console.log('Checking if user already exists with email:', email);

        // Use db.collection to interact with the database
        const credentialCollection = db.collection('users');

        // Check if the user already exists
        const existingUser = await credentialCollection.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(409).json({ error: 'User already exists' });
        }

        // Generate a salt and hash the password
        const saltRounds = 10; // You can adjust the number of salt rounds as needed
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        await credentialCollection.insertOne({ email, hashedPassword, salt });

        console.log('User registered successfully:', email);

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


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

    console.log('Received reset password request for email:', email);

    if (!email || !password) {
        console.log('Validation error: Email and password are required');
        return res.status(400).send('Email and password are required');
    }

    const saltRounds = 10; // You can adjust the number of salt rounds as needed

    // Use the existing Mongoose connection
    const db = mongoose.connection;

    console.log('Generated salt for password hashing');

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Hashed password:', hashedPassword);

        // Use db.collection to interact with the database
        const collection = db.collection('users');

        try {
            // Use updateOne to update the user's password
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
        }
    } catch (hashError) {
        console.error('Error hashing password:', hashError);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
