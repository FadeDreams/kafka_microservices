<template>
  <div>
    <h2>Welcome to the Dashboard</h2>
    <p>This is a protected page for authorized users.</p>
    <p v-if="isAuthenticated">Logged in as: {{ user ? user.email : 'Unknown' }}</p>

    <div v-if="orders.length > 0">
      <h3>Orders:</h3>
      <ul>
        <li v-for="order in orders" :key="order.id">
          <b>ID:</b> {{ order.id }}<br>
          <b>Product Name:</b> {{ order.productName }}<br>
          <b>Status:</b> {{ order.pstatus }}<br>
          <b>Quantity:</b> {{ order.quantity }}<br>
          <b>Price:</b> ${{ order.price }}<br>
          <hr>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      orders: [],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      axios.get('http://127.0.0.1:8000/order_reader/orders/')
        .then((response) => {
          this.orders = response.data;
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    },
  },
};
</script>

