<template>
  <p v-if="registrationMessage">{{ registrationMessage }}</p>
  <form @submit.prevent="register">
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
    </div>
    <div>
      <label for="password">Confirm Password:</label>
      <input type="password" id="confirm_password" v-model="confirm_password" required />
    </div>
    <div>
      <button type="submit">Register</button>
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
const confirm_password = ref('');
const registrationMessage = ref('');

const register = async () => {
  try {
    const apiUrl = process.env.VUE_APP_API_URL;
    const response = await axios.post(apiUrl + 'register', {
      email: email.value,
      password: password.value,
      confirm_password: confirm_password.value,
    });

    if (response.status === 200) {
      registrationMessage.value = 'Registration successful. You may now login.';
      router.push('/login'); // Redirect after setting the message
    } else {
      registrationMessage.value = 'Registration failed';
      console.error('Registration failed with status code:', response.status);
    }

  } catch (error) {
    registrationMessage.value = 'Registration failed';
    console.error('Error:', error);
  }
};
</script>

