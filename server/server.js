const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios'); // Import axios

const app = express();
const port = 5000;

const clientId = 'r74D0G3vFtnilgL6KNnpWKYmziMpenC9';
const clientSecret = 'YGeq04GfAptGMDre';

const url = "https://test.api.amadeus.com/v1/security/oauth2/token";

const params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', clientId);
params.append('client_secret', clientSecret);

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

// Function to make the request and return the access token
async function getAccessToken() {
    try {
        const response = await axios.post(url, params, { headers });
        console.log(response);
        console.log(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.use(cors());
app.use(express.json()); // Middleware to parse JSON body

app.get('/airport-data', (req, res) => {
  fs.readFile('../bunnyhacks-project/public/GlobalAirportDatabase.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(data);
  });
});

app.get('/fetchAirlineData', async (req, res) => {
    try {
        const { departureAirport , arrivalAirport, date } = req.body;

        const accessToken = await getAccessToken();
        const authorizationToken = `Bearer ${accessToken}`;

        const airLineUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers";
        
        console.log(departureAirport , arrivalAirport, date)
        const params = {
            originLocationCode: departureAirport,
            destinationLocationCode: arrivalAirport,
            departureDate: date,
            adults: 1,
            nonStop: false,
            max :200
        };

        const headers = {
            'Authorization': authorizationToken
        };

        console.log("auth token: ", authorizationToken)
        console.log("params : " ,params)
        console.log(headers)

        // Make the request to Amadeus API
        const response = await axios.get(airLineUrl, { headers, params });

        res.status(200).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching data from Amadeus API');
    }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
