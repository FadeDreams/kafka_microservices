import axios, { AxiosRequestConfig } from 'axios';

//const target = 'http://localhost:5001/user';
const target = 'http://127.0.0.1:1111/api/user';

//const target = 'http://order:5001/check_authentication';

export async function AuthChecker(accessToken: string) {
  console.log("AuthChecker", accessToken)

  try {
    // Define the headers with the access token and any custom headers
    const headers: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the provided access token
        //'Custom-Header': 'SomeValue' // Replace with any custom headers you need
      }
    };

    // Make the GET request with the defined headers
    const response = await axios.get(target, headers);
    console.log("***********************************************************")
    console.log("***********************************************************")

    console.log("response from auth service", response)
    return response.data;
  } catch (error) {
    console.error('Error calling AuthChecker:', error);
    throw error;
  }
}


