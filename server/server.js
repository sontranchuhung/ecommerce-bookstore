const express = require('express');
require('dotenv').config();

const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

const loginRouter = require('./api/auth/login'); 
const loginTokenCheck = require('./api/auth/loginToken.js')
const registerRouter = require('./api/auth/register.js')
const resetAccountRouter = require('./api/auth/resetAccount.js')

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

app.use('/login', loginRouter);
app.use('/validateLoginToken', loginTokenCheck)
app.use('/register', registerRouter);
app.use('/resetAccount', resetAccountRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
