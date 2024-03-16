<template>
  <div class="custom-loading" :style="{ zIndex }">
    <div class="loading-content" />
    <div class="loading-tips">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  zIndex: {
    type: Number,
    default: 10000
  }
});
</script>

<style lang="scss">
.custom-loading {
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--layer-bg-color);
}
.loading-tips {
  color: var(--vave-panel-title-color);
}
</style>
