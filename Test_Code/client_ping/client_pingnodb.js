const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Route to handle ping requests
app.get('/ping', (req, res) => {
  console.log('Ping received from ESP32!');
  
  // You can perform additional actions here if needed
  
  res.send('Pong');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
