const axios = require('axios');

// Data to send in the request
const data = {
  email: "x@x.com",
  password: "x"
};

// URL for the POST request
const url = 'http://localhost:1111/api/login'; // Corrected URL

// Making the POST request using Axios
axios.post(url, data)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

