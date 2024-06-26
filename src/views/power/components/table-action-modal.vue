<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item v-if="props.type === 'add'" :span="12" label="用户名" path="userName">
          <n-input v-model:value="formModel.userName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="props.type === 'edit'" :span="12" label="身份" path="userRole">
          <n-select v-model:value="formModel.userRole" :options="userStatusOptions" />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { defineEmits } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { useNotification, useMessage, NButton, NAvatar } from 'naive-ui';
import { genderOptions, userStatusOptions } from '@/constants';
import { userFind, userRoleChange } from '@/service';
import { formRules, createRequiredFormRule } from '@/utils';
import type { UserManagement } from '~/src/typings/business';
// import { getTableData } from '@/views/management/user/index.vue';
const message = useMessage();
const notification = useNotification();
export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'update-data'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '查找用户',
    edit: '编辑用户'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<UserManagement.User, 'userName' | 'password' | 'gender' | 'phone' | 'email' | 'userRole'>;

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  userName: createRequiredFormRule('请输入用户名'),
  password: formRules.pwd,
  phone: formRules.phone,
  email: formRules.email,
  userRole: createRequiredFormRule('请选择用户状态')
};

function createDefaultFormModel(): FormModel {
  return {
    userName: '',
    password: '',
    gender: null,
    phone: '',
    email: null,
    userRole: null
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  if (props.type === 'edit') {
    await formRef.value?.validate();
    const userRole = formModel.userRole;
    const id = formModel.id;
    await userRoleChange(id, userRole);
    window.$message?.success('操作成功!');
    emit('update-data');
  } else {
    const { data } = await userFind(formModel.userName);
    if (data?.length !== 0) {
      handleFind(data);
    } else {
      message.warning('未查询到该用户');
    }
  }
  closeModal();
}

async function handleFind(data) {
  notification.create({
    title: '查找信息如下：',
    content: `用户名：${data[0].userName}
	性别：${data[0].gender}
手机号码：${data[0].phone}
	邮箱：${data[0].email}
	身份：${data[0].userRole}`,
    onAfterLeave: () => {
      message.success('本次查询信息已关闭');
    }
  });
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
