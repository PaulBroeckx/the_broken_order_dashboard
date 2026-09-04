import { createRouter, createWebHistory } from "vue-router";
import { api } from "../services/api";
import DashboardView from "../views/DashboardView.vue";
import OrderDetailView from "../views/OrderDetailView.vue";
import LoginView from "../views/LoginView.vue";
import AboutView from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: LoginView },
    { path: "/", name: "dashboard", component: DashboardView, meta: { requiresAuth: true } },
    {
      path: "/orders/:id",
      name: "order-detail",
      component: OrderDetailView,
      props: true,
      meta: { requiresAuth: true },
    },
    { path: "/about", name: "about", component: AboutView, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  //delete api.defaults.headers.common.Authorization;

  const token = localStorage.getItem("auth_token");
  if (to.meta.requiresAuth && !token) {
    return { name: "login" };
  }
});

export default router;
