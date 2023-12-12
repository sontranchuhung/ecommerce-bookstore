const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

const loginRouter = require('./api/auth/login'); 

const app = express();
const port = process.env.PORT || 3010;
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/login', loginRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
