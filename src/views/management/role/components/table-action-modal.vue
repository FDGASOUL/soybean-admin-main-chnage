<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="index" path="index">
          <n-input v-model:value="formModel.index" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="id" path="id">
          <n-input v-model:value="formModel.id" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="beer_name" path="beer_name">
          <n-input v-model:value="formModel.beer_name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="style" path="style">
          <n-input v-model:value="formModel.style" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="ounces" path="ounces">
          <n-input v-model:value="formModel.ounces" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="abv" path="abv">
          <n-input v-model:value="formModel.abv" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="ibu" path="ibu">
          <n-input v-model:value="formModel.ibu" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="brewery_id" path="brewery_id">
          <n-input v-model:value="formModel.brewery_id" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="brewery_name" path="brewery_name">
          <n-input v-model:value="formModel.brewery_name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="city" path="city">
          <n-input v-model:value="formModel.city" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="state" path="state">
          <n-input v-model:value="formModel.state" />
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
import { genderOptions, userStatusOptions } from '@/constants';
import { dataChange } from '@/service';
import { formRules, createRequiredFormRule } from '@/utils';
import type { UserManagement } from '~/src/typings/business';
// import { getTableData } from '@/views/management/user/index.vue';

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
  editData?: UserManagement.Data | null;
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
    add: '添加数据',
    edit: '编辑数据'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<
  UserManagement.Data,
  'index' | 'id' | 'beer_name' | 'style' | 'ounces' | 'abv' | 'ibu' | 'brewery_id' | 'brewery_name' | 'city' | 'state'
>;

const formModel = reactive<FormModel>(createDefaultFormModel());

function createDefaultFormModel(): FormModel {
  return {
    index: null,
    id: null,
    beer_name: null,
    style: null,
    ounces: null,
    abv: null,
    ibu: null,
    brewery_id: null,
    brewery_name: null,
    city: null,
    state: null
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
  await formRef.value?.validate();
  await dataChange(formModel, props.type);
  window.$message?.success('操作成功!');
  emit('update-data');
  closeModal();
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
