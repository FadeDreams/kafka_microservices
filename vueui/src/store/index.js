import { createStore } from "vuex";
import axios from 'axios';
import axiosInstance from '@/axios-instance'; // Update the path to your Axios instance
const token = localStorage.getItem('token'); // Check localStorage for the token
const refresh_token = localStorage.getItem('refresh_token'); // Check localStorage for the token

export default createStore({
  state: {
    token: token || null,
    refresh_token: refresh_token || null,
    user: null,

  },
  getters: {
    isAuthenticated(state) {
      return state.token != null;
    },
    getUser(state) {
      return state.user;
    }

  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setRefreshToken(state, token) {
      state.refresh_token = token;
    },
    setUser(state, user) {
      state.user = user;
      console.log("in setuser", user)
    },
    clearAuth(state) {
      state.token = null;
    },
  },
  actions: {
    login({ commit }, { token, refresh_token, user }) {
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
      commit('setToken', token);
      commit('setRefreshToken', token);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearAuth');
    },
    async fetchUserData({ commit, state }) {
      try {
        const token = state.token;

        //const response = await axios.get('http://127.0.0.1:1111/api/user', {
        //headers: {
        //Authorization: `Bearer ${token}`,
        //},
        //});
        const response = await axiosInstance.get('/user');
        console.log('in fetchUserData', response.data)

        // Handle the response and user data as needed
        commit('setUser', response.data);
      } catch (error) {
        // Handle errors here
        console.error('Error:', error);
      }
    },
  },
  modules: {},
});
