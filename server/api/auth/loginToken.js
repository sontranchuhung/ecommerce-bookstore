const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

const router = express.Router();

router.use(cookieParser());

router.post('/', async (req, res) => {
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

module.exports = router;
