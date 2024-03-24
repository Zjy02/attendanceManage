template
<template>
  <div class="assess-container">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="签到记录" name="sign" />
      <el-tab-pane label="工资单" name="salaries" />
      <el-tab-pane
        label="全部"
        name="all"
        v-if="storage.getItem('actionList').includes('sign-update')"
      />
    </el-tabs>
    <div class="operate-container">
      <el-date-picker
        style="margin-left: 10px"
        v-model="dataTime"
        :type="activeName === 'sign' ? 'date' : 'month'"
        placeholder="请选择时间"
      />
      <el-input
        v-if="activeName === 'all'"
        v-model="userRealName"
        placeholder="请输入姓名"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">确定</el-button>
      <div class="message-card"></div>
    </div>

    <el-table
      :data="tableData"
      height="calc(100vh - 250px)"
      style="width: 95%; margin-left: 10px; align-self: flex-start"
      show-overflow-tooltip
      border
      stripe
    >
      <el-table-column type="index" width="80" label="序号" fixed="left" />
      <el-table-column
        v-for="item in tableHeader"
        :key="item.key"
        :label="item.name"
        :prop="item.key"
        :minWidth="item.minWidth"
        tooltip-effect="dark"
        align="center"
      >
        <template #default="{ row }"> </template>
      </el-table-column>
      <el-table-column width="120" label="操作" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            text
            @click="handleEdit(row)"
            v-has:add="'sign-edit'"
            v-show="activeName != 'sign'"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @current-change=""
      v-model:page-size="page.pageSize"
      background
      layout="total, prev, sizes, pager, next"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :total="page.total"
    />
    <EditUserSalaryListDialog
      :show-dialog="showDialog"
      :detailData="operateData"
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import api from '../../api';
import storage from '../../utils/storage.js';
import EditUserSalaryListDialog from '../components/EditUserSalaryListDialog.vue';
import dayjs from 'dayjs';

const userId = ref<Number>();
const userInfo = ref();
const tableData = ref([]);
const showDialog = ref(false);
const operateData = ref({});
const dataTime = ref('');
const activeName = ref('sign');
const userRealName = ref('');
const page = reactive({
  pageSize: 20,
  pageNum: 1,
  total: 0
});
const tableHeader = ref<any>([]);
const signHead = [
  { name: '姓名', key: 'realName', minWidth: '120', fixed: '' },
  { name: '工号', key: 'userId', minWidth: '150', fixed: '' },
  { name: '上班时间', key: 'workStartTime', minWidth: '150', fixed: '' },
  { name: '下班时间', key: 'workEndTime', minWidth: '150', fixed: '' },
  { name: '加班时长', key: 'extraTime', minWidth: '150', fixed: '' },
  { name: '早退时长', key: 'earlyTime', minWidth: '150', fixed: '' },
  { name: '迟到时长', key: 'delayTime', minWidth: '150', fixed: '' },
  { name: '迟到原因', key: 'lateReason', minWidth: '150', fixed: '' },
  { name: '早退原因', key: 'earlyReason', minWidth: '150', fixed: '' },
  { name: '下班打卡地址', key: 'endLocationName', minWidth: '150', fixed: '' },
  { name: '上班打卡地址', key: 'startLocationName', minWidth: '150', fixed: '' }
];

const salaryHeader = [
  { name: '姓名', key: 'realName', minWidth: '120', fixed: '' },
  { name: '工号', key: 'userId', minWidth: '120', fixed: '' },
  { name: '考核日期', key: 'examineDate', minWidth: '120', fixed: '' },
  { name: '罚金', key: 'penalty', minWidth: '120', fixed: '' },
  { name: '实际工作天数', key: 'realWorkDays', minWidth: '120', fixed: '' },
  { name: '实际工资', key: 'realSalary', minWidth: '120', fixed: '' },
  { name: '本月奖金', key: 'bonus', minWidth: '120', fixed: '' },
  { name: '底薪', key: 'basicSalary', minWidth: '120', fixed: '' },
  { name: '请假天数', key: 'leaveDays', minWidth: '120', fixed: '' },
  { name: '罚款说明', key: 'punishmentDescribe', minWidth: '120', fixed: '' }
];

watch(
  () => activeName.value,
  (val) => {
    tableData.value = [];
    if (val === 'sign') {
      tableHeader.value = signHead;
    } else {
      tableHeader.value = salaryHeader;
    }
    getTableData();
  }
);

onMounted(() => {
  getUserInfo();
  getTableData();
  tableHeader.value = signHead;
});

const getTableData = () => {
  const fn = {
    sign: api.getSignByTime,
    salaries: api.getSignListByTime,
    all: api.getAllUserPayRoll
  };
  fn[activeName.value]({
    userId: userId.value,
    time: dataTime.value,
    realName: userRealName.value
  }).then((res: any) => {
    tableData.value = res.recrods;
    page.total = res.total;
  });
};

const getUserInfo = () => {
  userInfo.value = storage.getItem('userInfo');
  userId.value = userInfo.value?.userId;
};
const handleEdit = (data) => {
  showDialog.value = true;
  operateData.value = data;
};

const handleSearch = () => {
  if (dataTime.value) {
    const fomat = activeName.value === 'sign' ? 'YYYY-MM-DD' : 'YYYY/MM';
    dataTime.value = dayjs(dataTime.value).format(fomat);
  }
  getTableData();
};

const handleClose = () => {
  showDialog.value = false;
  getTableData();
};
</script>

<style scoped lang="scss">
.assess-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: calc(100vh - 80px);
  background-color: #fff;
  border-radius: 15px;
  padding: 10px;
  .demo-tabs {
    width: 100%;
    margin-left: 0.2rem;
    align-self: flex-start;
  }
  .operate-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    .message-card {
      margin-left: auto;
      width: 60%;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    background-color: #fff;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    .pagination {
      align-self: flex-end;
    }
  }
}
</style>
