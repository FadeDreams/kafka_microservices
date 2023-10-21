import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//createApp(App).use(store).use(router).mount("#app");

const app = createApp(App);
app.use(store); // Use the Vuex store
app.use(router); // Use Vue Router
app.mount('#app');


router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next('/login'); // Redirect to the login page if not authenticated
    } else {
      next();
    }
  } else {
    next();
  }
});

