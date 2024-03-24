<template>
  <div class="assess-container">
    <div class="head">
      <el-input
        v-model="realName"
        style="width: 200px"
        class="head-input"
        :suffix-icon="Search"
        placeholder="请输入需要搜索的名字"
      />

      <el-input
        v-model="userId"
        style="width: 200px"
        class="head-input"
        :suffix-icon="Search"
        placeholder="请输入需要搜索的工号"
      />

      <el-input
        v-model="userName"
        style="width: 200px"
        class="head-input"
        :suffix-icon="Search"
        placeholder="请输入需要搜索的账户昵称"
      />

      <el-button type="primary" size="small" @click="getTableData"
        >搜索</el-button
      >
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        height="calc(100vh - 260px)"
        style="width: 95%"
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
          :formatter="(row) => row[item.key] || '--'"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="item.key === 'personalworkYears'">
              {{ row?.salaryInfo?.personalworkYears || 0 }}
            </span>
            <span v-else-if="item.key === 'tax'">
              {{ row?.salaryInfo?.tax || 0 }}
            </span>
            <span v-else-if="item.key === 'annualBonus'">
              {{ row?.salaryInfo?.annualBonus || 0 }}
            </span>
            <span v-else-if="item.key === 'deptId'">
              {{ row.deptId?.map((item) => item.deptName).join('/') }}
            </span>
            <span v-else-if="item.key === 'basicSalary'">
              {{ row?.salaryInfo?.basicSalary || 0 }}
            </span>
            <span v-else-if="item.key === 'sex'">
              {{ row?.sex == 1 ? '男' : '女' }}
            </span>
            <el-tag
              v-else-if="item.key === 'state'"
              :type="stateMap[row.state].color"
            >
              {{ stateMap[row.state].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text @click="handleEdit(row)"
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
    </div>
    <EditUserSalaryDialog
      :show-dialog="showDialog"
      :detailData="operateData"
      @close="() => (showDialog = false)"
      @reload="getTableData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import api from '../../api';
import EditUserSalaryDialog from '../components/EditUserSalaryDialog.vue';

const userName = ref('');
const realName = ref('');
const userId = ref<Number>();
const tableData = ref([]);
const showDialog = ref(false);
const operateData = ref({});
const page = reactive({
  pageSize: 20,
  pageNum: 1,
  total: 0
});
const stateMap = {
  1: {
    color: 'success',
    label: '在职'
  },
  2: {
    color: 'danger',
    label: '离职'
  },
  3: {
    color: 'primary',
    label: '实习期'
  }
};
const tableHeader = [
  { name: '姓名', key: 'realName', minWidth: '120', fixed: '' },
  { name: '工号', key: 'userId', minWidth: '150', fixed: '' },
  { name: '账号名称', key: 'userName', minWidth: '150', fixed: '' },
  { name: '年龄', key: 'age', minWidth: '100', fixed: '' },
  { name: '性别', key: 'sex', minWidth: '100', fixed: '' },
  {
    name: '工作年限',
    key: 'personalworkYears',
    minWidth: '100',
    fixed: ''
  },
  { name: '基础薪资', key: 'basicSalary', minWidth: '120', fixed: '' },
  { name: '税率', key: 'tax', minWidth: '120', fixed: '' },
  { name: '年终奖', key: 'annualBonus', minWidth: '120', fixed: '' },
  { name: '部门', key: 'deptId', minWidth: '150', fixed: '' },
  { name: '岗位', key: 'job', minWidth: '150', fixed: '' },
  { name: '状态', key: 'state', minWidth: '150', fixed: '' }
];

onMounted(() => {
  getTableData();
});

const getTableData = () => {
  api
    .queryAllUserSalary({
      userId: userId.value,
      userName: userName.value,
      realName: realName.value,
      pageSize: page.pageSize,
      pageNum: page.pageNum
    })
    .then((res: any) => {
      tableData.value = res.recrods;
      page.total = res.total;
    });
};

const handleEdit = (data) => {
  showDialog.value = true;
  operateData.value = data;
};
</script>

<style scoped lang="scss">
.assess-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 80px);
  .head {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 10px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: #fff;
  }
  .content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background-color: #fff;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    .pagination {
      align-self: flex-end;
    }
  }
}
</style>
