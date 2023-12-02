import requests

# Data to send in the request
data = {
    "email": "x@x.com",
    "password": "x"
}

# URL for the POST request
url = 'http://auth:8000/api/login'

# Making the POST request using the requests library
response = requests.post(url, json=data)

# Check the response status and content
if response.status_code == 200:
    print('Response:', response.json())
else:
    print('Error:', response.status_code, response.text)
