import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      redirect: "/dashboard",
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("../views/modules/Dashboard.vue"),
        },
        {
          path: "/system",
          name: "system",
          component: () => import("../views/modules/System.vue"),
        },
        {
          path: "/iptv",
          name: "iptv",
          component: () => import("../views/modules/Iptv.vue"),
        },
        {
          path: "/epg",
          name: "epg",
          component: () => import("../views/modules/Epg.vue"),
        },
        {
          path: "/tvb",
          name: "tvb",
          component: () => import("../views/modules/Tvb.vue"),
        },
        {
          path: "/update",
          name: "update",
          component: () => import("../views/modules/Update.vue"),
        },
        {
          path: "/updateLogs",
          name: "updateLogs",
          component: () => import("../views/modules/UpdateLogs.vue"),
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/modules/About.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  //　是否存在本地token
  const isLoggedIn = localStorage.getItem("token") ? true : false;

  // 如果目标是登录页，直接放行
  if (to.path === "/login") {
    next();
  } else {
    if (isLoggedIn) {
      // 如果已登录，则放行
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
