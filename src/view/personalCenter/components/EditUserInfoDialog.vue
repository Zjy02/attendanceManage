<template>
  <el-dialog
    :model-value="showDialog"
    title="编辑用户个人信息"
    width="500px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-col>
        <el-row :span="12">
          <el-form-item prop="userName" label="名称" label-width="100px">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item prop="realName" label="名字" label-width="100px">
            <el-input v-model="form.realName" />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="userId" label="工号" label-width="100px">
            <el-input v-model="form.userId" disabled />
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="sex" label="性别" label-width="100px">
            <el-select v-model="form.sex" style="width: 100px">
              <el-option :value="1" label="男" />
              <el-option :value="0" label="女" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="age" label="年龄" label-width="100px">
            <el-input v-model="form.age">
              <template #append>岁</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row :span="12">
          <el-form-item prop="annualBonus" label="邮箱" label-width="100px">
            <el-input
              v-model="form.userEmail"
              style="max-width: 600px"
              placeholder="请输入邮箱"
              class="input-with-select"
            >
              <template #append>
                <el-select
                  v-model="form.emailPre"
                  placeholder="Select"
                  style="width: 115px"
                >
                  <el-option label="@qq.com" value="@qq.com" />
                  <el-option label="@163.com" value="@163.com" />
                  <el-option label="@gmail.com" value="@gmail.com" />
                </el-select>
              </template>
            </el-input>
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
import api from '../../../api';

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
  age: 0,
  sex: '1',
  userId: '',
  userEmail: '',
  userName: '',
  realName: '',
  deptId: [],
  emailPre: '@163.com'
});
const rules = reactive({});

watch(
  () => props.showDialog,
  (val) => {
    if (val) {
      Object.keys(form).forEach((item) => {
        if (item == 'userEmail') {
          form[item] = props.detailData[item].split('@')[0];
        } else if (item === 'emailPre') {
          return;
        } else {
          form[item] = props.detailData[item];
        }
      });
    }
  }
);
const handleClose = () => {
  formRef.value.resetFields();
  emits('close');
};

const handleSubmit = () => {
  form.userEmail = form.userEmail + form.emailPre;
  api.userSubmit(form).then(() => {
    ElMessage.success('修改成功');
    handleClose();
    emits('reload');
  });
};
</script>
