<template>
  <div>
    <h2>Save Order</h2>
    <form @submit.prevent="saveOrder">
      <label for="productName">Product Name:</label>
      <input type="text" id="productName" v-model="productData.productName" required>

      <label for="pstatus">Product Status:</label>
      <input type="text" id="pstatus" v-model="productData.pstatus" required>

      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" v-model="productData.quantity" required>

      <label for="price">Price:</label>
      <input type="number" id="price" v-model="productData.price" required>

      <button type="submit">Save Order</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      productData: {
        productName: '',
        pstatus: '',
        quantity: 0,
        price: 0,
      },
    };
  },
  methods: {
    saveOrder() {

      axios.post(process.env.VUE_APP_INSERT_API_URL + 'orders', this.productData)
        .then(response => {
          //console.log(response);
          if (response.status === 201) {
            this.$router.push('/dashboard');
          }
        })
        .catch(error => {
          console.error('Error saving order:', error);
        });
    },
  },
};
</script>

