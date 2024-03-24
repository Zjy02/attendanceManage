<template>
  <div class="welcome">
    <div class="title">welcome to back</div>
    <div class="title">后台管理系统</div>
    <div class="desc">
      Vue3 + ElementPlus + Node + MongoDB 打造的薪资考核后台管理系统
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcome'
};
</script>

<style scoped lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background-color: #fff;
  background-image: url(../assets/background.png);
  background-size: contain;
  width: 100%;
  color: #fff;
  border-radius: 15px;
  .title {
    font-size: 40px;
    line-height: 62px;
    margin-left: 20px;
  }
  .desc {
    margin-left: 25px;
    font-size: 14px;
    color: #999;
  }
}
@media (max-width: 1200px) {
  .img {
    transform: scale(0.7);
  }
}

@media (max-width: 1000px) {
  .img {
    transform: scale(0.6);
  }
}

@media (max-width: 800px) {
  .img {
    transform: scale(0.5);
  }
}

@media (max-width: 600px) {
  .img {
    transform: scale(0.4);
  }
}
</style>
