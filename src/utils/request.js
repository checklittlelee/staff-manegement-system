// axios 的二次封装

import axios from "axios"
import config from "../config/index"
import { ElMessage } from "element-plus"
import router from "../router"
import storage from "../store"

const TOKEN_INVALID = "Token认证失败，请重新登录"
const NETWORK_ERROR = "网络请求异常，请稍后重试"

const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
})

// 请求拦截器
service.interceptors.request.use(
  (req) => {
    const headers = req.headers
    const { token = "" } = storage.getItem("userInfo") || {}

    // 如果请求头没有 Authorization，则添加
    if (!headers.Authorization) headers.Authorization = "Bearer " + token

    return req
  },
  (err) => {
    return Promise.reject(err)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { code, data, msg } = res.data

    // 处理成功响应
    if (code === 200) {
      return data
    }

    // 处理 TOKEN 失效
    if (code === 50001) {
      ElMessage.error(TOKEN_INVALID)
      setTimeout(() => {
        router.push("/login")
      }, 1500)
      return Promise.reject(TOKEN_INVALID)
    }

    // 处理响应数据中的其他错误
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  },
  (err) => {
    ElMessage.error(err.message || NETWORK_ERROR)
    return Promise.reject(err)
  },
)

/**
 * 请求核心函数
 * @param {*} options 请求配置：URL、请求数据、请求方法和其他选项
 */
function request(options) {
  options.method = options.method || "get"
  if (options.method.toLowerCase() === "get") {
    options.params = options.data // get请求中，查询参数放在 params 中
  }
  // let isMock = config.mock
  // if (typeof options.mock != 'undefined') {
  //     isMock = options.mock;
  // }
  // // console.log(config.mock);
  // if (config.env === 'prod') {
  //     service.defaults.baseURL = config.baseApi
  // } else {
  //     service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  // }

  return service(options) // 使用 Axios 实例发送请求，返回Promise对象
}

// 定义请求方法别名(创建5个函数)：request.get、request.post、request.put、request.delete、request.patch
// 函数接收三个参数，函数内部调用request函数，传入一个对象
;["get", "post", "put", "delete", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item, // 指定请求方法
      ...options, // 传入其他选项
    })
  }
})

export default request
