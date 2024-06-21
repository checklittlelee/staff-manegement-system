import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import request from "./utils/request"
import storage from "./utils/storage"
import api from "./api"
// import util from "./utils/utils"

import * as ElementPlusIconsVue from "@element-plus/icons-vue"

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.directive("has", {
  beforeMount: (el, binding) => {
    let userAction = storage.getItem("actionList")
    let value = binding.value
    let hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style.display = "none"
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0)
    }
  },
})

// 添加全局属性
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage

app.use(router)
app.use(store)
app.mount("#app")
