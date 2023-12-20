const express = require('express');
require('dotenv').config();

const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the MongoDB database');
});


const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, // Allow credentials (cookies) to be sent with requests
}));

app.use(cookieParser());
const port = process.env.PORT || 3010;
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const authController = require('./controllers/AuthController');
app.use('/auth', authController);

const checkoutController = require('./controllers/CheckoutController');
app.use('/checkout', checkoutController);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
