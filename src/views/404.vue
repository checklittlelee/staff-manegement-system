<template>
  <div>
    <span>404</span>
    <el-button @click="goHome">回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
const router = useRouter()

const goHome = () => {
  router.push("/")
}
</script>

<style lang="scss" scoped></style>
