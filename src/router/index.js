import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ErrorView from "../views/ErrorView.vue";
import NoDataView from "../views/NoDataView.vue";
// import { useDataStore } from "@/stores/useDataStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/noData",
      name: "NoDataPage",
      component: NoDataView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/:catchAll(.*)", // 通配符路由
      name: "error",
      component: ErrorView,
    },
  ],
});

// router.beforeEach(async (to, from, next) => {

//   next();
// });
export default router;
