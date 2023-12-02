import requests

# URL for the GET request
url = 'http://auth:8000/api/user'

# Bearer token
token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZXhwIjoxNjk4MTU4MzgxfQ.rEEHCy6-kEtkDgQt2VEafOjhBt-gchBVUdmk3_IadTE'

# Headers with the Bearer token
headers = {
    'Authorization': token
}

# Making the GET request using the requests library with headers
response = requests.get(url, headers=headers)

# Check the response status and content
if response.status_code == 200:
    print('Response:', response.json())
else:
    print('Error:', response.status_code, response.text)

