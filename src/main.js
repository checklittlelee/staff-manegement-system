import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import request from "./utils/request"
import api from "./api"
import storage from "./utils/storage"

const app = createApp(App)

// 添加全局属性
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage

app.use(router)
app.use(store)
app.mount("#app")
