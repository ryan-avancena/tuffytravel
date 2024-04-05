const axios = require('axios');

// Replace with your actual client ID and client secret
const clientId = 'r74D0G3vFtnilgL6KNnpWKYmziMpenC9';
const clientSecret = 'YGeq04GfAptGMDre';

// API endpoint
const url = "https://test.api.amadeus.com/v1/security/oauth2/token";

// Request parameters
const params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', clientId);
params.append('client_secret', clientSecret);

// Request headers
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

// Function to make the request and return the access token
async function getAccessToken() {
    try {
        const response = await axios.post(url, params, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to handle it outside of this function if needed
    }
}

// Usage example
async function main() {
    try {
        const accessToken = await getAccessToken();
        console.log(accessToken);

        const url = 'https://test.api.amadeus.com/v1/reference-data/locations/pois';
        
        const latitude = 41.397158;
        const longitude = 2.160873;
        const radius = 1;
        const pageLimit = 5;
        const pageOffset = 0;

        const authorizationToken = `Bearer ${accessToken}`;

        // API endpoint
        const airLineUrl = "https://test.api.amadeus.com/v1/reference-data/locations/pois?";

        // Request parameters
        const params = {
            latitude,
            longitude,
            radius,
            categories: ['SIGHTS', 'NIGHTLIFE', 'RESTAURANT', 'SHOPPING']
        };

        // Request headers
        const headers = {
            'Authorization': authorizationToken
        };

        // Make the request
        axios.get(airLineUrl, { headers, params })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });

    } catch (error) {
        console.error(error)
    }
}

main();