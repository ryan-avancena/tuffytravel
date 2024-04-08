"use client"

import React, { useState, useEffect } from 'react';
const axios = require('axios');

function RequestToken() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Define your async function to fetch the access token
        async function fetchAccessToken() {
            // Replac   e with your actual client ID and client secret
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

            try {
                // Make the request to fetch the access token
                const response = await axios.post(url, params, { headers });
                // console.log(response)
                setAccessToken(response.data.access_token);
            } catch (error) {
                console.error(error);
            }
        }

        // Call the fetchAccessToken function when the component mounts
        fetchAccessToken();
        
    }, []);

    console.log(accessToken)
    return accessToken;

}

export default RequestToken; 