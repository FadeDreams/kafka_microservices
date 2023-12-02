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
          <b></b>
          <button v-if="!order.disableButton" @click="buyOrder(order)">Buy</button>
          <span v-if="order.disableButton">Bought</span>
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
  async created() {
    if (this.isAuthenticated) {
      await this.fetchUserData();
    }
    this.fetchOrders();
  },

  methods: {
    async fetchUserData() {
      if (!this.isAuthenticated) {
        return; // Do not fetch user data if not authenticated
      }

      try {
        await this.$store.dispatch('fetchUserData');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    fetchOrders() {
      axios.get('http://localhost:8001/order_reader/orders/')
        .then((response) => {
          // Initialize the "disableButton" property for each order
          this.orders = response.data.map((order) => ({
            ...order,
            disableButton: false,
          }));
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    },
    buyOrder(order) {
      // Check if the button is already disabled
      if (order.disableButton) {
        return; // Do nothing if already disabled
      }

      // Handle the "Buy" button click event here
      // You can use the order properties as needed
      console.log('Buy button clicked for Order ID:', order.id);
      console.log('Price:', order.price);
      console.log('user:', this.user.id);

      var data = {
        "user_id": this.user.id.toString(),
        "amount": order.price.toString()
      };

      axios.post(`http://localhost:5002/buy/${order.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // Mark the button as disabled upon successful response
          order.disableButton = true;
          console.log("Purchase successful.");
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    }
  },
};
</script>

