// localStorage 的二次封装

import config from "../config"

export default {
  // 获取所有数据
  getStorage() {
    try {
      return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
    } catch (e) {
      console.error("Error parsing JSON from localStorage:", e)
      return {}
    }
  },

  // 获取某项数据
  getItem(key) {
    return this.getStorage()[key]
  },

  // 设置数据
  setItem(key, val) {
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },

  // 删除数据
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },

  // 清空所有数据
  clearAll() {
    window.localStorage.removeItem(config.namespace) // 仅删除命名空间对应的localStorage项，避免误删其他应用数据
  },
}

// localStorage只能存储字符串类型的数据
// 数据序列化：JSON.stringify 转换成字符串后再存储
// 数据反序列化：JSON.parse 读取时转回对象或数组
