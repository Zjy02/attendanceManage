<template>
  <div class="person">
    <el-row class="person-container">
      <el-col :span="8" class="left-side">
        <div class="user">
          <el-avatar
            class="user-avatar"
            :size="150"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="user-main">
            <span class="user-name">zhou jin yu</span>
            <span class="user-email">1831783781@qq.com</span>
            <span class="user-role">前段开发工程师</span>
          </div>
        </div>
        <el-card class="user-info" style="border-radius: 10px" shadow="hover">
          <el-row class="user-detail">
            <el-col :span="12" class="col-item"
              >账号名称：<span>{{ 'admin' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >姓名：<span>{{ 'zhoujinyu' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >邮箱：<span>{{ '1831783781@qq.com' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >工号：<span>{{ '100012' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >性别：<span>{{ '男' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >年龄：<span>{{ 20 }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >入职时间：<span>{{ '2020-03-10' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >工龄：<span>{{ 3 }}</span></el-col
            >
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15" class="right-side">
        <div class="head">
          <span>{{ new Date() }}</span>
        </div>
        <div>
          <el-button type="primary" :icon="Promotion" circle :size="200" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Promotion } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.person {
  height: calc(100vh - 80px);
  .person-container {
    height: 100%;
  }
  .left-side {
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    gap: 5px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    .user {
      display: flex;
      align-items: center;
      flex-basis: 30%;
      justify-content: flex-start;
      gap: 20px;
      border-radius: 15px;
      border: 1px solid rgb(228, 231, 237);
      .user-avatar {
      }
      .user-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        .user-name {
          font-size: 30px;
          font-weight: 900;
          transition: all 0.5s;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            transform: scale(1.1);
          }
        }
        .user-email,
        .user-role {
          height: 70%;
          font-size: 12px;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .user-info {
        border-radius: 15px;
        flex-basis: 70%;
      }
    }

    .user-detail {
      border-radius: 15px;
      height: calc(100vh - 350px);
    }
    .col-item {
      font-size: 14px;
    }
  }
  .right-side {
    height: 100%;
    margin-left: 10px;
    background-color: #fff;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    padding: 10px 20px;
  }
}
</style>
