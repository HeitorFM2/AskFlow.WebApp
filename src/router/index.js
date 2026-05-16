import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to) => {
    const token = localStorage.getItem("accessToken");
    const isAuthenticated = !!token;

    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: "login" };
    }

    if (to.meta.guest && isAuthenticated) {
      return { name: "feed" };
    }
  });

  return Router;
});
