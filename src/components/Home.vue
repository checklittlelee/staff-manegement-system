eww
<template>
  <div class="basic-layout">
    <!-- 左 -->
    <div class="nav-side">
      <!-- 系统LOGO -->
      <div class="logo" @click="goHome">
        <img src="../assets/logo.png" alt="" />
        <span>员工管理系统</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        router
      >
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <!-- 右 -->
    <div class="content-right">
      <div class="nav-top">
        <!-- 左侧：折叠按钮 + 面包屑 -->
        <div class="nav-left">
          <div class="menu-fold" @click="menuToggle">
            <el-icon><Fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <!-- 右侧：用户信息 -->
        <div class="user-info">
          <el-badge
            type="danger"
            class="notice"
            :is-dot="noticeCount > 0 ? true : false"
            :offset="[2, 15]"
            @click="badgeToggle"
          >
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown>
            <span class="user-link">
              用户
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled
                  >邮箱：{{ userEmail }}</el-dropdown-item
                >
                <el-dropdown-item @click="logoutToggle">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import TreeMenu from "./TreeMenu.vue"
import BreadCrumb from "./BreadCrumb.vue"

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()

const noticeCount = computed(() => store.state.noticeCount)
const userEmail = computed(() => store.state.userInfo?.userEmail || "")

// 获取通知数据，分发 Vuex action 执行异步操作
const fetchNoticeCount = () => {
  store.dispatch("fetchNoticeCount")
}
// 获取菜单栏数据，请求接口，存储 Vuex state 及 localStorage
let userMenu = ref([])
const getMenuList = async () => {
  try {
    const { menuList, actionList } = await proxy.$api.permissionList()
    userMenu.value = menuList
    // console.log(menuList, "menuList")
    store.commit("saveMenuList", menuList)
    store.commit("saveActionList", actionList)
  } catch (error) {
    console.error("Failed to fetch menu list:", error)
  }
}
onMounted(() => {
  fetchNoticeCount()
  getMenuList()
})

// 点击折叠按钮
const menuToggle = () => {
  console.log("点击折叠按钮")
}
// 点击通知按钮
const badgeToggle = () => {
  console.log("点击通知按钮")
}
// 点击退出登录按钮
const logoutToggle = async () => {
  try {
    await ElMessageBox.confirm("你确定要退出登录吗?", "确认退出", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    ElMessage({
      type: "success",
      message: "等出成功！",
    })
    await store.commit("clearUserInfo")
    await store.commit("clearMenuList")
    await store.commit("clearActionList")
    router.push("/login")
  } catch (error) {
    if (error !== "cancel") {
      console.log("Logout failed:", error)
      ElMessage({
        message: "登出失败！",
        type: "error",
      })
    }
  }
}
// 点击Logo回到首页
const goHome = () => {
  router.push("/welcome")
}
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  // 左
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background: #001529;
    color: #fff;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
  }
  // 右
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .nav-left {
        display: flex;
        align-items: center;
        padding-left: 10px;
        .menu-fold {
          margin: 6px 15px 0px 0px;
          font-size: 18px;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        padding-right: 10px;
        .notice {
          margin: 6px 30px 0px 0px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      height: calc(100vh - 50px);
      background: #eef0f3;
      padding: 15px;
    }
  }
}
</style>
