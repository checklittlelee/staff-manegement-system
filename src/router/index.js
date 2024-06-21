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
  // 如果存在token，就通过API获取权限路由列表menuList
  if (userInfo.token) {
    try {
      const { menuList } = await API.permissionList()
      // 通过generateRoute函数生成路由数组
      let routes = util.generateRoute(menuList)
      // 动态导入组件
      const modules = import.meta.glob("../views/**/*.vue")
      // 动态添加路由
      routes.map((route) => {
        let url = `../views/${route.component}.vue`
        route.component = modules[url]
        router.addRoute("home", route)
      })
    } catch (error) {
      console.error("Failed to load async routes", error)
    }
  }
}
await loadAsyncRoutes()

// 通过递归遍历菜单列表，生成包含路径、名称、标题和组件的路由对象
function generateRoute(menuList) {
  let routes = []
  const deepList = (list) => {
    while (list.length) {
      let item = list.pop()
      if (item.action) {
        routes.push({
          name: item.component,
          path: item.path,
          meta: {
            title: item.menuName,
          },
          component: item.component,
        })
      }
      if (item.children && !item.action) {
        deepList(item.children)
      }
    }
  }
  deepList(menuList)
  return routes
}

function checkPermission(path) {
  let hasPermission = router
    .getRoutes() // 获取所有已注册的路由
    .filter((route) => route.path == path).length // 过滤出与给定路径匹配的路由
  return hasPermission > 0
}

// 使用 checkPermission 函数检查目标路径是否有权限访问，如果有权限则设置页面标题并继续导航，否则跳转到404页面
router.beforeEach((to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next("/404")
  }
})

console.log(router.getRoutes()) // 打印所有已注册的路由

export default router
