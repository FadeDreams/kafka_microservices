<template>
  <div>
    <h2>Welcome to the Dashboard</h2>
    <p>This is a protected page for authorized users.</p>
    <p v-if="isAuthenticated">Logged in as: {{ user ? user.email : 'Unknown' }}</p>
    <!-- Add your dashboard content here -->
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

