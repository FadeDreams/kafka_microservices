<template>
  <form @submit.prevent="login">
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the router

const store = useStore();
const router = useRouter(); // Access the router
const email = ref('');
const password = ref('');

const login = async () => {
  try {
    const apiUrl = process.env.VUE_APP_AUTH_API_URL;
    console.log(apiUrl)
    const response = await axios.post(apiUrl + 'login', {
      email: email.value,
      password: password.value,
    });

    // Assuming the response contains a "token" and "user" property
    const token = response.data.token;
    const user = response.data.user;

    // Handle the token and user data as needed (e.g., store in Vuex state, local storage, etc.)
    console.log('Token:', token);
    console.log('User:', user);
    store.dispatch('login', { token, user });

    // Redirect the user to the dashboard page
    router.push('/dashboard');

  } catch (error) {
    // Handle any errors here, e.g., display an error message.
    console.error('Error:', error);
  }
};
</script>

