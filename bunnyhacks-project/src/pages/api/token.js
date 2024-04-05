// pages/api/token.js

import axios from 'axios';

const clientId = 'r74D0G3vFtnilgL6KNnpWKYmziMpenC9';
const clientSecret = 'YGeq04GfAptGMDre';
const url = "https://test.api.amadeus.com/v1/security/oauth2/token";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', clientId);
            params.append('client_secret', clientSecret);

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            const response = await axios.post(url, params, { headers });
            const accessToken = response.data.access_token;

            res.status(200).json({ accessToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
