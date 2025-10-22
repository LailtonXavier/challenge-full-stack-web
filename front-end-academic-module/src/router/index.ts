import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/core/infra/store/authStore";
import LoginRegister from '@/views/LoginRegister.vue';
import Home from '@/views/Home.vue';

const routes = [
  { path: "/", name: "login", component: LoginRegister },
  { path: "/home", name: "home", component: Home, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return next({ name: "login" });
  }

  if (to.name === "login" && auth.isAuthenticated()) {
    return next({ name: "home" });
  }

  next();
});

export default router;
