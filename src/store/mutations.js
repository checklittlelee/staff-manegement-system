import storage from "../utils/storage"

export default {
  // 保存用户信息并同步到 localStorage
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem("userInfo", userInfo)
  },
  // 清除用户信息并从 localStorage 移除
  clearUserInfo(state) {
    state.userInfo = null
    storage.clearItem("userInfo")
  },
  // 保存通知计数
  saveNoticeCount(state, count) {
    state.noticeCount = count
  },
  // 保存菜单列表并同步到 localStorage
  saveMenuList(state, menuList) {
    state.menuList = menuList
    storage.setItem("menuList", menuList)
  },
  // 清除菜单列表并从 localStorage 移除
  clearMenuList(state) {
    state.menuList = null
    storage.clearItem("menuList")
  },
  // 保存操作列表并同步到 localStorage
  saveActionList(state, actionList) {
    state.actionList = actionList
    storage.setItem("actionList", actionList)
  },
  // 清除操作列表并从 localStorage 移除
  clearActionList(state) {
    state.actionList = null
    storage.clearItem("actionList")
  },
}
