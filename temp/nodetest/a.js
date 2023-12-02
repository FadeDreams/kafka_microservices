const axios = require('axios');

const url = 'http://auth:8000/api/user';
const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiZXhwIjoxNjk4MTU4MzgxfQ.rEEHCy6-kEtkDgQt2VEafOjhBt-gchBVUdmk3_IadTE';
const headers = {
  'Authorization': token
};

const maxRetries = 3;

function makeRequestWithRetry(retries) {
  axios.get(url, { headers })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 503 && retries < maxRetries) {
        console.log(`Retrying (${retries + 1}/${maxRetries})...`);
        makeRequestWithRetry(retries + 1);
      } else {
        console.error('Error:', error.response.status, error.response.data);
      }
    });
}

makeRequestWithRetry(0);

