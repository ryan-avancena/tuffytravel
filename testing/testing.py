import requests

# Replace with your actual authorization token
authorization_token = "Bearer r74D0G3vFtnilgL6KNnpWKYmziMpenC9"

# API endpoint
url = "https://test.api.amadeus.com/v1/shopping/flight-destinations"

# Request parameters
params = {
    "origin": "PAR",
    "maxPrice": 200
}

# Request headers
headers = {
    "Authorization": authorization_token
}

# Make the request
response = requests.get(url, params=params, headers=headers)

# Print response
print(response.json())
