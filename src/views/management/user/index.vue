<template>
  <div class="h-full overflow-hidden">
    <n-card title="已注册用户管理" :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-button
            v-model:value="checkedRowKeyRef"
            type="error"
            :disabled="deleteFlag"
            @click="handleDeleteTables(checkedRowKeyRef)"
          >
            <icon-ic-round-delete class="mr-4px text-20px" />
            删除
          </n-button>
          <n-button type="error" @click="SearchData"> <icon-uil:search class="mr-4px text-20px" />搜索 </n-button>
          <n-button type="success" @click="getTableData(auth.userInfo.userRole, 'false')">
            <icon-uil:export class="mr-4px text-20px" />
            只显示管理员
          </n-button>
        </n-space>
        <n-space align="center" :size="18">
          <n-button size="small" type="primary" @click="getTableData(auth.userInfo.userRole, 'true')">
            <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
            刷新
          </n-button>
          <!-- <column-setting v-model:columns="columns" /> -->
        </n-space>
      </n-space>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"
      />
      <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @update-data="init" />
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { genderLabels, userStatusLabels } from '@/constants';
import { fetchUserList, fetchUserdel, fetchUserdels } from '@/service';
import { useAuthStore } from '@/store';
import { useBoolean, useLoading } from '@/hooks';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
import ColumnSetting from './components/column-setting.vue';
import type { UserManagement } from '~/src/typings/business';

const auth = useAuthStore();
const Role = auth.userInfo.userRole === 'super' ? 1 : 2;
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const checkedRowKeyRef = ref([]);
const deleteFlag = ref(false);
function handleCheck(rowKeys) {
  checkedRowKeyRef.value = rowKeys;
  console.log('-=选中的复选框 id为', rowKeys);
  console.log(checkedRowKeyRef.value);
  const valuelist = Object.keys(rowKeys);
  if (valuelist.length === 0) deleteFlag.value = true;
  else deleteFlag.value = false;
	console.log(valuelist.length);
	console.log(deleteFlag.value);
}

async function handleDeleteTables(rowKeys) {
  const headerlist = Object.keys(rowKeys);
  const result = [];

  for (let i = 0; i < headerlist.length; i++) {
    result.push(rowKeys[headerlist[i]]);
  }
  await fetchUserdels(result,auth.userInfo.userRole);
  getTableData(auth.userInfo.userRole, 'true');
  window.$message?.info(`删除成功`);
}

const tableData = ref<UserManagement.User[]>([]);
function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}

async function getTableData(power: string, all: string) {
  startLoading();
  const { data } = await fetchUserList(power, all);
  if (data) {
    setTimeout(() => {
      setTableData(data);
      endLoading();
    }, 300);
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'index',
    title: '序号',
    align: 'center'
  },
  {
    key: 'userName',
    title: '用户名',
    align: 'center'
  },
  {
    key: 'gender',
    title: '性别',
    align: 'center',
    render: row => {
      if (row.gender) {
        const tagTypes: Record<UserManagement.GenderKey, NaiveUI.ThemeColor> = {
          '0': 'success',
          '1': 'primary'
        };

        return <NTag type={tagTypes[row.gender]}>{genderLabels[row.gender]}</NTag>;
      }

      return <span></span>;
    }
  },
  {
    key: 'phone',
    title: '手机号码',
    align: 'center'
  },
  {
    key: 'email',
    title: '邮箱',
    align: 'center'
  },
  {
    key: 'userRole',
    title: '身份',
    align: 'center',
    render: row => {
      if (row.userRole) {
        const tagTypes: Record<UserManagement.UserStatusKey, NaiveUI.ThemeColor> = {
          '1': 'error',
          '2': 'success',
          '3': 'warning'
        };

        return <NTag type={tagTypes[row.userRole]}>{userStatusLabels[row.userRole]}</NTag>;
      }
      return <span></span>;
    }
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.id)} disabled={row.userRole == Role}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton size={'small'} disabled={row.userRole == Role}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

// function handleAddTable() {
//   openModal();
//   setModalType('add');
// }

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

function handleDeleteTable(rowId: string) {
  fetchUserdel(rowId);
  getTableData(auth.userInfo.userRole, 'true');
  window.$message?.info(`该用户信息已删除`);
}

async function SearchData(rowKeys) {
  const headerlist = Object.keys(rowKeys);
  const result = [];

  for (let i = 0; i < headerlist.length; i++) {
    result.push(rowKeys[headerlist[i]]);
  }
  await fetchUserdels(result,auth.userInfo.userRole);
  getTableData(auth.userInfo.userRole, 'true');
  window.$message?.info(`删除成功`);
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

function init() {
  getTableData(auth.userInfo.userRole, 'true');
}

// function getEmptyDataSource() {
//   startLoading();
//   setTimeout(() => {
//     dataSource.value = [];
//     endLoading();
//     setEmpty(!dataSource.value.length);
//   }, 1000);
// }

// 初始化
init();
</script>

<style scoped></style>
