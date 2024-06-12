<template>
  <div class="basic-layout">
    <!-- 左 -->
    <div class="nav-side">
      <!-- 系统LOGO -->
      <div class="logo">logo~</div>
      <!-- 导航菜单 -->
      <TreeMenu class="nav-menu" />
    </div>
    <!-- 右 -->
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">
          <BreadCrumb />
        </div>
        <div class="user-info">用户信息</div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import TreeMenu from "./TreeMenu.vue"
import BreadCrumb from "./BreadCrumb.vue"
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
      background: #eeb0b0; //
      display: flex;
      justify-content: space-between;
      .bread {
        background: #aad69c;
      }
    }
    .wrapper {
      height: calc(100vh - 50px);
      background: #8893d5; //
    }
  }
}
</style>
