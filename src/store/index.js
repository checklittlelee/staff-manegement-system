import { createStore } from "vuex"
import mutations from "./mutations"
import storage from "../utils/storage"
import api from "../api"

const store = createStore({
  state: {
    userInfo: storage.getItem("userInfo") || "",
    noticeCount: 0,
    menuList: storage.getItem("menuList") || [],
    actionList: storage.getItem("actionList") || [],
  },
  mutations,
  actions: {
    async fetchNoticeCount({ commit }) {
      try {
        const res = await api.noticeCount()
        commit("saveNoticeCount", res)
      } catch (error) {
        console.error("Failed to fetch notice count:", error)
      }
    },
  },
})

export default store
