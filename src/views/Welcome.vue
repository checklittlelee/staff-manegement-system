<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">vue3全栈项目</div>
      <div class="desc">
        —— Vue3 + Element Plus + Node.js + MongoDB 打造员工管理系统
      </div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #656565;
    }
    .title {
      font-size: 40px;
      line-height: 70px;
      color: #409eff;
    }
    .desc {
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    width: 371px;
    height: 438px;
    background-image: url("../assets/images/welcome.png");
  }
}
</style>
