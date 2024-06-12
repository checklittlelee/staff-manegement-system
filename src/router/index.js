import { createWebHashHistory, createRouter } from "vue-router"

import Home from "../components/Home.vue"

const routes = [
  {
    path: "/",
    name: "home",
    meta: { title: "首页" },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "欢迎页",
        },
        component: () => import("../views/Welcome.vue"),
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/Login.vue"),
  },
  {
    name: "404页面",
    path: "/404",
    meta: {
      title: "404",
    },
    component: () => import("../views/404.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
