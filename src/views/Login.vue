<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="loginForm" :model="loginInfo" :rules="rules" status-icon>
        <div class="title">登录</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            :prefix-icon="User"
            v-model="loginInfo.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            :prefix-icon="View"
            v-model="loginInfo.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="btn-login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import util from "../utils/utils"
import storage from "../utils/storage"
import API from "../api"
import { User, View } from "@element-plus/icons-vue"

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()
const loginForm = ref(null) // 表单的引用，用于表单校验

const loginInfo = reactive({
  userName: "admin",
  userPwd: "123456",
})

// 登录表单校验规则
const rules = reactive({
  userName: [{ required: true, message: "请输出用户名", trigger: "blur" }],
  userPwd: [{ required: true, message: "请输出密码", trigger: "blur" }],
})

// 点击登录按钮
const login = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      proxy.$api.login(loginInfo).then((res) => {
        store.commit("saveUserInfo", res)
        loadAsyncRoutes()
        router.push("/welcome")
      })
    } else {
      return false
    }
  })
}

const loadAsyncRoutes = async () => {
  let userInfo = storage.getItem("userInfo") || {}
  if (userInfo.token) {
    try {
      const { menuList } = await API.permissionList()
      let routes = util.generateRoute(menuList)
      const modules = import.meta.glob("../**/*.vue")
      routes.map((route) => {
        let url = `./${route.component}.vue`
        route.component = modules[url]
        router.addRoute("home", route)
      })
    } catch (error) {}
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #f9fcff;
  .modal {
    width: 500px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    padding: 60px;
    .title {
      font-size: 20px;
      line-height: 1.5;
      text-align: center;
      color: #959595;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
