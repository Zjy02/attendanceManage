<template>
  <div class="basic-layout">
    <div class="nav-side">
      <div class="logo">
        <img class="logo-img" src="./../assets/logo.png" />
        Manager
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        text-color="#333"
        router
      >
        <tree-menu :userMenu="MenuList" class="menu-container" />
      </el-menu>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">
          <el-icon @click="toggle"><Operation /></el-icon>
          <BreadCrumb />
        </div>
        <div class="rightBox">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="item"
            @click="this.$router.push('/audit/approve')"
          >
            <el-icon color="blue" class="icon"><BellFilled /></el-icon>
          </el-badge>

          <el-dropdown @command="handleLogout">
            <span class="el-dropdown-link">
              <el-icon class="use-icon"><User /></el-icon>
              <span class="use-name">
                {{ userInfo.userName }}
              </span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personCenter">
                  <el-icon><UserFilled /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><Failed /></el-icon>
                  <span>退出</span>
                </el-dropdown-item>
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

<script>
import { ArrowDown } from '@element-plus/icons-vue';
import TreeMenu from './TreeMenu.vue';
import BreadCrumb from './BreadCrumb.vue';
export default {
  name: 'home',
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      MenuList: [],
      activeMenu: location.hash.slice(1)
    };
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount;
    }
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuItem();
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
    },

    handleLogout(key) {
      if (key == 'logout') {
        this.$store.commit('saveUserInfo', '');
        this.userInfo = {};
        this.$router.push('/login');
      }
    },

    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.$store.commit('saveNoticCount', count);
      } catch (error) {
        console.log(error);
      }
    },
    async getMenuItem() {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList();
        this.MenuList = menuList;
        //将菜单列表保存到loaclstorage
        this.$store.commit('saveUserMenu', menuList);
        //将权限列表保存到loaclstorage
        this.$store.commit('saveUserAction', actionList);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss">
.basic-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  .nav-side {
    width: 14vw;
    height: 100vh;
    color: #333;
    overflow: auto;
    transition: width 0.5s;
    .el-menu-vertical-demo {
      width: 100%;
    }
    :deep(.el-menu) {
      :deep(.el-menu-item.is-active) {
        background-color: blue;
      }
    }
    .logo {
      margin-top: 5px;
      font-size: 20px;
      font-weight: 600;
      color: #409eff;
      display: flex;
      align-items: center;
      gap: 10px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 100px;
      }
      .logo-img {
        margin-left: 10px;
      }
    }
  }
  .content-right {
    width: 86vw;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .bread {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .rightBox {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 15px;
        height: 100%;
        .use-name {
          font-size: 16px;
          font-weight: 600;
        }
        .item {
          width: 20px;
          height: 30%;
          display: flex;
          align-items: center;
          cursor: pointer;
          .icon {
            width: 20px;
            height: 20px;
          }
        }

        .el-dropdown-link {
          cursor: pointer;
          user-select: none;
          height: 100%;
          display: flex;
          .use-icon {
            margin-right: 10px;
          }
          .el-icon--right {
            margin-left: 10px;
          }
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
  }
}
@media (max-width: 1200px) {
  .logo {
    transform: scale(0.7);
  }
}

@media (max-width: 1000px) {
  .logo {
    transform: scale(0.6);
  }
}

@media (max-width: 800px) {
  .logo {
    transform: scale(0.5);
  }
}

@media (max-width: 600px) {
  .logo {
    transform: scale(0.4);
  }
}
</style>
