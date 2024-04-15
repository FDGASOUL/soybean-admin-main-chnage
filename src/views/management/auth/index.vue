<template>
  <div class="h-full overflow-hidden">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
      <n-grid-item span="0:24 640:24 1024:10">
        <n-card title="信息管理" :bordered="false" class="rounded-16px shadow-sm">
          <n-space class="pb-12px" justify="space-between">
            <n-space> </n-space>
            <n-space align="center" :size="18">
              <n-button size="small" type="primary" @click="getData()">
                <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
                刷新
              </n-button>
            </n-space>
          </n-space>
          <div class="w-full h-360px py-12px">
            <n-row>
              <n-col :span="12">
                <n-statistic label="用户名" :value="tableData.userName"> </n-statistic>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <n-statistic label="性别" :value="tableData.gender"> </n-statistic>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <n-statistic label="联系电话" :value="tableData.phone"> </n-statistic>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <n-statistic label="电子邮箱" :value="tableData.email"> </n-statistic>
              </n-col>
            </n-row>
            <n-button class="mt-24px whitespace-pre-wrap" type="primary" @click="handleEditTable"
              ><icon-carbon:brush-freehand class="mr-4px text-20px" /> 编辑</n-button
            >
          </div>
          <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @update-data="init" />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { genderLabels, userStatusLabels } from '@/constants';
import { fetchUserData, fetchDatadel, fetchDatadels, fetchMissingList } from '@/service';
import { useAuthStore } from '@/store';
import { useBoolean, useLoading } from '@/hooks';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
import type { UserManagement } from '~/src/typings/business';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const checkedRowKeyRef = ref([]);
const deleteFlag = ref(false);

const tableData = reactive({
  userName: '',
  gender: '',
  phone: '',
  email: ''
});

async function getData() {
  startLoading();
  const { data } = await fetchUserData();
  tableData.userName = data.userName;
  tableData.gender = data.sex;
  tableData.phone = data.phone;
  tableData.email = data.email;
  endLoading();
}

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);
function setEditData(data) {
  editData.value = data;
}
function handleEditTable() {
  setEditData(tableData);
  setModalType('edit');
  openModal();
}
function init() {
  getData();
}

// 初始化
init();
</script>

<style scoped></style>
