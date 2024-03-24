<template>
  <div class="person">
    <el-row class="person-container">
      <el-col :span="8" class="left-side">
        <div class="user">
          <el-avatar
            class="user-avatar"
            style="flex-shrink: 1"
            :size="100"
            fit="scale-down"
            :src="userInfo?.avatar || defaultAvatarUrl"
          />
          <div class="user-main">
            <span class="user-name">{{
              userInfo?.realName || '修改名字'
            }}</span>
            <span class="user-email">{{ userInfo?.userEmail }}</span>
            <span class="user-role">{{ userInfo?.job }}</span>
            <el-button
              size="small"
              style=""
              :icon="EditPen"
              @click="handleEditUser"
              >修改信息</el-button
            >
          </div>
        </div>
        <el-card class="user-info" style="border-radius: 10px" shadow="hover">
          <el-row class="user-detail">
            <el-col :span="12" class="col-item"
              >账号名称：<span>{{ userInfo?.userName }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >姓名：<span>{{ userInfo?.realName || '' }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >邮箱：<span>{{ userInfo?.userEmail }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >工号：<span>{{ userInfo?.userId }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >性别：<span>{{
                userInfo?.sex === 1 ? '男' : '女'
              }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >年龄：<span>{{ userInfo?.age }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >入职时间：<span>{{
                dayjs(userInfo?.createTime).format('YYYY-MM-DD')
              }}</span></el-col
            >
            <el-col :span="12" class="col-item"
              >工龄：<span>{{
                dayjs().diff(dayjs(userInfo?.createTime), 'year')
              }}</span></el-col
            >
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15" class="right-side">
        <div class="head">
          <div class="head-time">
            <el-icon><Timer /></el-icon>
            时间：
            <span>{{ nowTime }}</span>
          </div>
          <div class="head-position">
            <el-icon><Position /></el-icon>
            位置：
            <span>{{ locationName }}</span>
          </div>
        </div>
        <el-row class="sign-row">
          <el-col :span="11" class="sign-container">
            <div class="sign-in">
              <span
                >打上班卡 {{ signTodayMessage?.workStartTime || nowTime }}</span
              >
              <span v-if="signTodayMessage?.workStartTime">今天已打上班卡</span>
              <span v-if="isDelay"
                >迟到原因：
                <el-input
                  v-model="lateReason"
                  style="width: 150px"
                  placeholder="请输入迟到原因"
              /></span>
              <el-button
                type="primary"
                circle
                style="width: 100px; height: 100px; margin-top: 20px"
                @click="signStart"
              >
                <el-icon size="40"><Promotion /></el-icon>
              </el-button>
            </div>
            <el-divider />
            <div class="sign-in">
              <span
                >打下班卡 {{ signTodayMessage?.workEndTime || nowTime }}</span
              >
              <span v-if="signTodayMessage?.workEndTime">今天已打下班卡</span>
              <span v-if="isEarly"
                >早退原因：
                <el-input v-model="earlyReason" placeholder="请输入早退原因"
              /></span>
              <el-button
                type="primary"
                circle
                style="width: 100px; height: 100px; margin-top: 20px"
                @click="signEnd"
              >
                <el-icon size="40"><Promotion /></el-icon>
              </el-button>
            </div>
          </el-col>
          <el-col :span="13" class="sign-map">
            <div id="map"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <EditUserInfoDialog
      :detail-data="userInfo"
      :showDialog="showDialog"
      @close="() => (showDialog = false)"
      @reload="getNewUserInfo"
    />
  </div>
</template>

<script setup>
import { Promotion, Position, Timer, EditPen } from '@element-plus/icons-vue';
import { onMounted, ref, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/index';
import storage from '../../utils/storage.js';
import dayjs from 'dayjs';
import EditUserInfoDialog from './components/EditUserInfoDialog.vue';

let map;
const userInfo = ref();
const userId = ref();
const lateReason = ref('');
const earlyReason = ref('');
const isDelay = ref(false);
const isEarly = ref(false);
const signTodayMessage = ref({});
const nowTime = ref();
const locationName = ref('');
const location = ref([]);
const showDialog = ref(false);
const defaultAvatarUrl =
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
const geocoder = new AMap.Geocoder({
  city: 'wuhan', //城市设为北京，默认：“全国”
  radius: 1000 //范围，默认：500
});
const signLocation = ref([]);
const marker = new AMap.Marker();

let timeInterval;

onMounted(() => {
  getUserInfo();
  querySignRecrods();
  getLocation();
  timeInterval = setInterval(() => {
    nowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const currentHour = dayjs().hour();
    if (
      !isDelay.value &&
      !signTodayMessage.value?.workStartTime &&
      currentHour > 9
    ) {
      isDelay.value = true;
    }
    if (
      !isEarly.value &&
      signTodayMessage.value?.workStartTime &&
      !signTodayMessage.value?.workEndTime &&
      currentHour < 18
    ) {
      isEarly.value = true;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});

const getUserInfo = () => {
  userInfo.value = storage.getItem('userInfo');
  userId.value = userInfo.value?.userId;
};

const getNewUserInfo = () => {
  api.getUserInfo().then((res) => {
    const old = storage.getItem('userInfo');
    Object.assign(old, res);
    storage.setItem('userInfo', old);
    getUserInfo();
  });
};

const querySignRecrods = () => {
  const time = dayjs().format('YYYY-MM-DD');
  api.querySign({ userId: userId.value, time }).then((res) => {
    signTodayMessage.value = res || null;
    locationName.value = signTodayMessage.value?.startLocationName
      ? signTodayMessage.value?.endLocationName
      : signTodayMessage.value?.startLocationName;
  });
};

const getLocation = () => {
  // 获取位置信息
  navigator.geolocation.getCurrentPosition(
    (val) => {
      const data = val.coords;
      signLocation.value = [data.latitude, data.longitude];
      getLocationMap();
    },
    (err) => {
      console.log(err);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

const getLocationMap = () => {
  map = new AMap.Map('map', {
    resizeEnable: true
  });
  map.on('click', function (e) {
    location.value = [e.lnglat.lng, e.lnglat.lat];
    location.value = e.lnglat;
    regeoCode();
  });
};

const regeoCode = () => {
  const lnglat = location.value;
  map.add(marker);
  marker.setPosition(lnglat);
  geocoder.getAddress(lnglat, function (status, result) {
    if (status === 'complete' && result.regeocode) {
      const address = result.regeocode.formattedAddress;
      locationName.value = address;
    } else {
      log.error('根据经纬度查询地址失败');
    }
  });
};

const signStart = () => {
  api
    .signIn({
      userId: userId.value,
      lateReason: lateReason.value,
      location: location.value,
      startLocationName: locationName.value
    })
    .then((res) => {
      ElMessage.success('上班签到成功');
      querySignRecrods();
      isDelay.value = false;
      lateReason.value = '';
    });
};

const signEnd = () => {
  api
    .signOut({
      userId: userId.value,
      earlyReason: earlyReason.value,
      location: location.value,
      endLocationName: locationName.value
    })
    .then((res) => {
      ElMessage.success('下班签到成功');
      querySignRecrods();
      isEarly.value = false;
      earlyReason.value = '';
    });
};
const handleEditUser = () => {
  showDialog.value = true;
};
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
      justify-content: space-around;
      gap: 20px;
      padding: 10px 10px;
      border-radius: 15px;
      border: 1px solid rgb(228, 231, 237);

      .user-main {
        flex-shrink: 1;
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
    .head {
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      .head-time {
        width: 30%;
        display: flex;
        align-items: center;
      }
      .head-position {
        width: 70%;
        display: flex;
        align-items: center;
      }
    }
    .sign-row {
      height: calc(100% - 50px);
    }
    .sign-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      .sign-in {
        height: 40%;
        display: flex;
        gap: 5px;
        flex-direction: column;
        align-items: center;
      }
    }
    .sign-map {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      & > #map {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
