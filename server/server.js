// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

app.get('/airport-data', (req, res) => {
  fs.readFile('../bunnyhacks-project/public/GlobalAirportDatabase.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Send the data as a response
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});