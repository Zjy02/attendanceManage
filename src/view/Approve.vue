<template>
  <div class="user-manger">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm" size="small">
        <el-form-item label="审批状态" prop="state" style="width: 150px">
          <el-select v-model="queryForm.applyState">
            <el-option label="所有" :value="0" />
            <el-option label="待审批" :value="1" />
            <el-option label="审批中" :value="2" />
            <el-option label="审批拒绝" :value="3" />
            <el-option label="审批通过" :value="4" />
            <el-option label="作废" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table approve-table">
      <div class="action"></div>
      <div>
        <el-table
          :data="applyList"
          height="calc(100vh - 280px)"
          size="small"
          border
          stripe
        >
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :minWidth="item.minWidth"
            :formatter="item.formatter"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="item.prop === 'leaveTime'">{{
                row[item.prop] + '天'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                type="primary"
                @click="handleDetail(row)"
                v-show="row.applyState == 1 || row.applyState == 2"
                v-has:add="'approve-review'"
                text
                size="small"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pagination"
        @current-change="getApplyList"
        v-model:page-size="pager.pageSize"
        background
        layout="total, prev, sizes, pager, next"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :total="pager.total"
      />
    </div>

    <el-dialog
      title="审核"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-form
        ref="dialogForm"
        :model="auditForm"
        label="120px"
        label-suffix=":"
      >
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :row="3"
            aria-placeholder=""
            v-model="auditForm.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleApprove('pass')"
            >审核通过</el-button
          >
          <el-button type="primary" @click="handleApprove('refuse')"
            >驳回</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { watch, withCtx } from 'vue';
import utils from './../utils/utils';
import { onMounted, ref, reactive, getCurrentInstance, toRaw } from 'vue';
import dayjs from 'dayjs';
export default {
  name: 'approve',
  setup() {
    const detail = ref({});
    const showDetailModal = ref(false);
    const { proxy } = getCurrentInstance();
    const userInfo = proxy.$store.state.userInfo;
    const currentpage = ref(1);
    const isApprove = ref(true);
    const pager = reactive({
      pageSize: 10,
      pageNum: 1,
      total: 0
    });
    const applyList = ref([]);
    const queryForm = reactive({
      applyState: 1
    });
    const leaveForm = reactive({
      applyState: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ''
    });
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo',
        minWidth: '100px'
      },
      {
        label: '申请人',
        prop: 'applyUser',
        formatter(row) {
          return row.applyUser.userName;
        },
        minWidth: '100px'
      },
      {
        label: '休假时间',
        prop: '',
        formatter(row, columns, value) {
          return (
            dayjs(row.startTime).format('YYYY-MM-DD') +
            ' 至 ' +
            dayjs(row.endTime).format('YYYY-MM-DD')
          );
        },
        minWidth: '180px'
      },
      {
        label: '休假时长',
        prop: 'leaveTime',
        minWidth: '100px'
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter(row, columns, value) {
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value];
        },
        minWidth: '100px'
      },
      {
        label: '休假原因',
        prop: 'reasons',
        minWidth: '100px'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        width: 180,
        formatter(row, columns, value) {
          return utils.formatDate(new Date(value));
        },
        minWidth: '120px'
      },
      {
        label: '审批人',
        prop: 'auditUsers',
        minWidth: '180px'
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName',
        minWidth: '100px'
      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter(row, columns, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value];
        },
        minWidth: '100px'
      }
    ]);
    const auditForm = reactive({
      remark: ''
    });

    //初始化数据
    onMounted(() => {
      getApplyList();
    });
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager, type: 'approve' };
      let { list, page } = await proxy.$api.getApplyList(params);
      pager.total = page.total;
      applyList.value = list;
    };

    //插询按要求查询用户
    const handleQuery = () => {
      getApplyList();
    };
    //重置表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    //分页
    watch(currentpage, (newVal, oldVal) => {
      pager.pageNum = newVal;
      getuserList();
    });

    const handleApprove = (action) => {
      proxy.$refs.dialogForm.validate(async (validate) => {
        if (validate) {
          let params = {
            action,
            remark: auditForm.remark,
            _id: detail.value._id
          };
          try {
            await proxy.$api.leaveApprove(params);
            handleClose();
            proxy.$message.success('处理成功');
            getApplyList();
            proxy.$store.commit('saveNoticCount', proxy.$store.noticeCount - 1);
          } catch (error) {}
        }
      });
    };
    //取消按钮关闭弹窗
    const handleClose = () => {
      showDetailModal.value = false;
      handleReset('dialogForm');
    };
    const handleDetail = (row) => {
      showDetailModal.value = true;
      let data = { ...row };
      data.applyTypeName = {
        1: '事假',
        2: '调休',
        3: '年假'
      }[data.applyType];
      data.time =
        utils.formatDate(new Date(row.startTime), 'yyyy-MM-dd') +
        ' 至 ' +
        utils.formatDate(new Date(row.endTime), 'yyyy-MM-dd');
      data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
      }[data.applyState];
      detail.value = data;
      showDetailModal.value = true;
    };

    return {
      applyList,
      queryForm,
      pager,
      currentpage,
      columns,
      leaveForm,
      detail,
      userInfo,
      auditForm,
      showDetailModal,
      isApprove,
      handleDetail,
      handleApprove,
      getApplyList,
      handleClose,
      handleQuery,
      handleReset
    };
  }
};
</script>

<style lang="scss">
.pagination {
  align-self: flex-end;
}
.query-form {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.approve-table {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 170px);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
</style>
