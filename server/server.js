// server.js

const express = require('express');
const app = express();
const port = 3001; // Choose your preferred port number

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
