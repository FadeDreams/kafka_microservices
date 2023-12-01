const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 1111,
  path: '/api/user',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZXhwIjoxNjk4MTU4MzgxfQ.rEEHCy6-kEtkDgQt2VEafOjhBt-gchBVUdmk3_IadTE'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Response:', data);
    } else {
      console.error(`Request failed with status ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();

