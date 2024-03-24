<template>
  <div class="login-wrapper">
    <LoginComponent />
  </div>
</template>

<script setup>
import LoginComponent from '../components/Login/LoginComponent.vue';
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100%;
  height: 100vh;
  background-image: url(../assets/login.jpg);
  background-size: contain;
}
</style>
