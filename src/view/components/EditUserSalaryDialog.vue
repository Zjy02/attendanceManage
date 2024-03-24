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
          <el-form-item prop="tax" label="税率" label-width="100px">
            <el-input v-model="form.tax" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="annualBonus" label="年终奖" label-width="100px">
            <el-input v-model="form.annualBonus" />
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
const emits = defineEmits(['close', 'reload']);
const formRef = ref();
const form = reactive({
  tax: 0,
  annualBonus: 0,
  basicSalary: 0,
  realName: '',
  userId: ''
});
const rules = reactive({});

watch(
  () => props.showDialog,
  (val) => {
    if (val) {
      console.log(props.detailData);
      form.userId = props.detailData.userId;
      form.annualBonus = props.detailData.salaryInfo?.annualBonus || 0;
      form.basicSalary = props.detailData.salaryInfo?.basicSalary || 0;
      form.tax = props.detailData.salaryInfo?.tax || 0;
    }
  }
);
const handleClose = () => {
  formRef.value.resetFields();
  emits('close');
};

const handleSubmit = () => {
  api.updateUserSalary(form).then(() => {
    ElMessage.success('修改成功');
    handleClose();
    emits('reload');
  });
};
</script>
