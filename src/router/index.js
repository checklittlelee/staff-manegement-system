import { createWebHashHistory, createRouter } from "vue-router"

const routes = [
  {
    path: "/",
    name: "home",
    meta: { title: "首页" },
    component: Home,
    redirect: "/welcome",
    child: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "欢迎页",
        },
        component: Welcome,
      },
    ],
  },
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录",
    },
    component: Login,
  },
  {
    name: "404页面",
    path: "/404",
    meta: {
      title: "404",
    },
    component: Login,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
