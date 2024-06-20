import { createWebHashHistory, createRouter } from "vue-router"
import storage from "../utils/storage"
import util from "../utils/utils"
import API from "../api"

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
      // {
      //   name: "system",
      //   path: "/system",
      //   meta: {
      //     title: "系统管理",
      //   },
      //   redirect: { name: "user" },
      //   children: [
      //     {
      //       name: "user",
      //       path: "user",
      //       meta: {
      //         title: "用户管理",
      //       },
      //       component: () => import("../views/User.vue"),
      //     },
      //     {
      //       name: "menu",
      //       path: "menu",
      //       meta: {
      //         title: "菜单管理",
      //       },
      //       component: () => import("../views/Menu.vue"),
      //     },
      //     {
      //       name: "role",
      //       path: "role",
      //       meta: {
      //         title: "角色管理",
      //       },
      //       component: () => import("../views/Role.vue"),
      //     },
      //     {
      //       name: "dept",
      //       path: "dept",
      //       meta: {
      //         title: "部门管理",
      //       },
      //       component: () => import("../views/Dept.vue"),
      //     },
      //   ],
      // },
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

async function loadAsyncRoutes() {
  let userInfo = storage.getItem("userInfo") || {}
  if (userInfo.token) {
    try {
      const { menuList } = await API.permissionList()

      let routes = util.generateRoute(menuList)
      const modules = import.meta.glob("../views/**/*.vue")
      routes.map((route) => {
        let url = `../views/${route.component}.vue`

        route.component = modules[url]
        router.addRoute("home", route)
      })
    } catch (error) {}
  }
}
await loadAsyncRoutes()

function checkPermission(path) {
  let hasPermission = router
    .getRoutes()
    .filter((route) => route.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next("/404")
  }
})

export default router
