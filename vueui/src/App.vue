<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/logout">Logout</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/about">About</router-link>
  </nav>

  <router-view />
</template>

<script>
export default {

  methods: {
    async logout() {
      const apiUrl = process.env.VUE_APP_AUTH_API_URL;

      try {
        await this.$axios.post(apiUrl + '/logout');
        // You can also perform any additional cleanup or state changes here
        // For example, clearing the user's session or resetting some data.
        // Once the POST request is successful, you can navigate to the login or home page.
        this.$router.push('/login'); // Change '/login' to your desired login route.
      } catch (error) {
        console.error('Error logging out:', error);
        // Handle any errors that occur during the logout process.
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
