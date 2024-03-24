<template>
  <el-dialog
    :model-value="showDialog"
    title="编辑用户资产信息"
    width="500px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-col>
        <el-row :span="12">
          <el-form-item prop="realName" label="名字" label-width="100px">
            <el-input v-model="form.realName" disabled />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="userId" label="工号" label-width="100px">
            <el-input v-model="form.userId" disabled />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="basicSalary" label="底薪" label-width="100px">
            <el-input v-model="form.basicSalary" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="examineDate" label="考核日期" label-width="100px">
            <el-input v-model="form.examineDate" disabled />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item
            prop="realWorkDays"
            label="实际工作日期"
            label-width="100px"
          >
            <el-input v-model="form.realWorkDays" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="realSalary" label="实际薪资" label-width="100px">
            <el-input v-model="form.realSalary" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="bonus" label="本月奖金" label-width="100px">
            <el-input v-model="form.bonus" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item
            prop="leaveDays"
            label="本月请假天数"
            label-width="100px"
          >
            <el-input v-model="form.leaveDays" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item
            prop="punishmentDescribe"
            label="罚款说明"
            label-width="100px"
          >
            <el-input
              v-model="form.punishmentDescribe"
              type="textarea"
              :row="4"
            />
          </el-form-item>
        </el-row>
      </el-col>
    </el-form>
    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api';

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  detailData: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(['close']);
const formRef = ref();
const form = reactive({
  penalty: 0,
  realWorkDays: 0,
  realSalary: 0,
  bonus: '',
  basicSalary: '',
  leaveDays: '',
  punishmentDescribe: '',
  examineDate: '',
  realName: '',
  userId: ''
});
const rules = reactive({});

watch(
  () => props.showDialog,
  (val) => {
    if (val) {
      Object.keys(form).forEach((item) => {
        form[item] = props.detailData[item];
      });
      console.log(props.detailData);
    }
  }
);
const handleClose = () => {
  formRef.value.resetFields();
  emits('close');
};

const handleSubmit = () => {
  api.updateUserPayRoll(form).then(() => {
    ElMessage.success('修改成功');
    handleClose();
  });
};
</script>
