import { createStore } from "vuex"
import mutations from "./mutations"
import storage from "../utils/storage"
import api from "../api"

const store = createStore({
  state() {
    return {
      userInfo: storage.getItem("userInfo") || "",
    }
  },
  mutations,
})

export default store
