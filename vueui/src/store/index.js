import { createStore } from "vuex";

export default createStore({
  state: {
    token: null,
    user: null,

  },
  getters: {
    isAuthenticated(state) {
      return state.token != null;
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuth(state) {
      state.token = null;
    },
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('setToken', token);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearAuth');
    },
    async fetchUserData({ commit, state }) {
      try {
        const token = state.token;

        const response = await axios.get('http://127.0.0.1:1111/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
