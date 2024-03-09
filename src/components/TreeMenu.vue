<template>
  <template v-for="menu in userMenu">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
      :index="menu.path"
    >
      <template #title>
        <el-icon><Expand /></el-icon>
        <span class="menuName">{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>

    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu"
      class="menuName"
    >
      <template #title>
        <el-icon><Coin /></el-icon>
        {{ menu.menuName }}
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
defineOptions({
  name: 'TreeMenu'
});

defineProps({
  userMenu: {
    type: Array,
    default() {
      return [];
    }
  }
});
</script>

<style scoped>
.menuName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 10px;
}
</style>
