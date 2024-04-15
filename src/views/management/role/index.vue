<template>
  <div class="h-full overflow-hidden">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
      <n-grid-item span="0:24 640:24 1024:5">
        <n-card :bordered="false" class="h-full rounded-16px shadow-sm">
          <n-select
            v-model:value="value"
            :options="options"
            :consistent-menu-width="false"
            @update:value="handleUpdateValue"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:24 1024:24">
        <n-card title="数据管理" :bordered="false" class="rounded-16px shadow-sm">
          <n-space class="pb-12px" justify="space-between">
            <n-space>
              <n-button type="primary" @click="addData">
                <icon-ic-round-plus class="mr-4px text-20px" />
                新增
              </n-button>
              <n-button type="error" @click="searchData"> <icon-uil:search class="mr-4px text-20px" />搜索 </n-button>
              <n-button type="success" @click="getMissingData()">
                <icon-uil:export class="mr-4px text-20px" />
                只显示缺失数据
              </n-button>
            </n-space>
            <n-space align="center" :size="18">
              <n-button size="small" type="primary" @click="getData()">
                <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
                刷新
              </n-button>
              <!-- <column-setting v-model:columns="columns" /> -->
            </n-space>
          </n-space>
          <loading-empty-wrapper class="h-600px" :loading="loading" :empty="empty">
            <n-data-table
              :columns="columns"
              :data="dataSource"
              :flex-height="true"
              :pagination="pagination"
              class="h-600px"
            />
          </loading-empty-wrapper>
        </n-card>
      </n-grid-item>
    </n-grid>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" :title="cardTitle" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" size="large" :show-label="false">
          <n-form-item>
            <n-select
              v-model:value="valueSelect"
              :options="options_edit"
              :consistent-menu-width="false"
              @update:value="handleUpdateValueEdit"
            />
          </n-form-item>
          <n-form-item>
            <n-input v-model:value="valueEditInput[valueSelect]" placeholder="请输入" />
          </n-form-item>
          <n-form-item>
            <n-space class="w-full pt-16px" :size="24" justify="end">
              <n-button class="w-72px" @click="closeModal">取消</n-button>
              <n-button class="w-72px" type="primary" @click="handleClick"> 确定 </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { DataTableColumn, NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { genderLabels, userStatusLabels } from '@/constants';
import { dataAdd, dataChange, fetchDataList, fetchDataName, fetchDatadel, fetchDatadels, fetchMissingList, searchSomeData } from '@/service';
import { useAuthStore } from '@/store';
import { useBoolean, useLoading } from '@/hooks';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
import type { UserManagement } from '~/src/typings/business';

const value = ref('clean');
const options = ref([]);
const valueSelect = ref(' 请选择属性 ');
const options_edit = ref([]);
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const checkedRowKeyRef = ref([]);
const deleteFlag = ref(false);
const dataSource = ref([]);
const allDataSource = ref([]);
const cardTitle = ref('数据编辑');
const buttonTitle = ref('修改');
const searchType = ref('');
const valueEditInput = ref({});
const showModal = ref(false);
const rowID = ref(0);
let columns: DataTableColumn[] = [];

async function getDataName() {
  startLoading();
  const { data } = await fetchDataName();
  options.value = data.map(item => {
    return {
      label: item,
      value: item
    };
  });
}

async function handleUpdateValue() {
  startLoading();
  getData();
  endLoading();
}

// const tableData = ref<UserManagement.Data[]>([]);

async function getData() {
  startLoading();
  const name = value.value;
  const { data } = await fetchDataList(name);
  const data_header = Object.keys(data);
  const data_value = Object.values(data);
  const data_header_now = [];
  for (let i = 0; i < data_header.length; i++) {
    if (data_header[i] !== 'dataId') {
      data_header_now.push(data_header[i]);
    }
  }
  columns = [];
  columns = data_header_now.map(item => {
    return {
      title: item,
      key: item,
      align: 'center'
    };
  });
  columns.push({
    key: 'action',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.dataId)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.dataId)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  });
  dataSource.value = [];
  // data_value是一个类，内容是二维数组，他的行号是data_header的下标，列号是每个data_header的值，把每一行的值赋给data_source
  let rowlen = 0;
  for (let i = 0; i < data_value.length; i++) {
    for (let j = 0; j < 1; j++) {
      rowlen = data_value[i].length;
    }
  }
  for (let i = 0; i < rowlen; i++) {
    const data_source = {};
    for (let j = 0; j < data_header.length; j++) {
      data_source[data_header[j]] = data_value[j][i];
    }
    dataSource.value.push(data_source);
    allDataSource.value.push(data_source);
  }
  endLoading();
  // if (data) {
  //   setTimeout(() => {
  //     setTableData(data);
  //     endLoading();
  //   }, 300);
  // }
}

async function getMissingData() {
  startLoading();
  const name = value.value;
  const { data } = await fetchMissingList(name);
  const data_header = Object.keys(data);
  const data_value = Object.values(data);
  const data_header_now = [];
  for (let i = 0; i < data_header.length; i++) {
    if (data_header[i] !== 'dataId') {
      data_header_now.push(data_header[i]);
    }
  }
  columns = [];
  columns = data_header_now.map(item => {
    return {
      title: item,
      key: item,
      align: 'center'
    };
  });
  columns.push({
    key: 'action',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.dataId)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.dataId)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  });
  dataSource.value = [];
  // data_value是一个类，内容是二维数组，他的行号是data_header的下标，列号是每个data_header的值，把每一行的值赋给data_source
  let rowlen = 0;
  for (let i = 0; i < data_value.length; i++) {
    for (let j = 0; j < 1; j++) {
      rowlen = data_value[i].length;
    }
  }
  for (let i = 0; i < rowlen; i++) {
    const data_source = {};
    for (let j = 0; j < data_header.length; j++) {
      data_source[data_header[j]] = data_value[j][i];
    }
    dataSource.value.push(data_source);
    allDataSource.value.push(data_source);
  }
  endLoading();
}

function handleEditTable(rowId: string) {
  cardTitle.value = '编辑';
  buttonTitle.value = '修改';
  const findItem = dataSource.value.find(item => item.dataId === Number(rowId));
  const changeKeys = [];
  Object.keys(findItem).forEach(item => {
    if (item !== 'tid') {
      changeKeys.push(item);
    }
  });
  options_edit.value = changeKeys.map(item => {
    return {
      label: item,
      value: item
    };
  });
  valueSelect.value = Object.keys(findItem)[0];
  const findItemNew = {};
  changeKeys.forEach(item => {
    findItemNew[item] = String(findItem[item]);
  });
  valueEditInput.value = findItemNew;
  rowID.value = Number(rowId);
  showModal.value = true;
}

function addData() {
  cardTitle.value = '新增';
  buttonTitle.value = '添加';
  const changeKeys = [];
  Object.keys(allDataSource.value[0]).forEach(item => {
    if (item !== 'tid') {
      changeKeys.push(item);
    }
  });
  options_edit.value = changeKeys.map(item => {
    return {
      label: item,
      value: item
    };
  });
  const findItemNew = {};
  changeKeys.forEach(item => {
    findItemNew[item] = '';
  });
  valueEditInput.value = findItemNew;
  showModal.value = true;
}

function searchData() {
  cardTitle.value = '查询';
  buttonTitle.value = '查询';
  const changeKeys = [];
  Object.keys(allDataSource.value[0]).forEach(item => {
    if (item !== 'dataId') {
      changeKeys.push(item);
    }
  });
  options_edit.value = changeKeys.map(item => {
    return {
      label: item,
      value: item
    };
  });
  const findItemNew = {};
  changeKeys.forEach(item => {
    findItemNew[item] = '';
  });
  valueEditInput.value = findItemNew;
  showModal.value = true;
}

async function handleClick() {
  if (cardTitle.value === '编辑') {
    await dataChange(rowID.value, valueEditInput.value);
    window.$message?.success(`编辑成功`);
    await getData();
  } else if (cardTitle.value === '新增') {
    await dataAdd(valueEditInput.value, value.value);
    window.$message?.success(`添加成功`);
    await getData();
  } else if (cardTitle.value === '查询') {
    const { data } = await searchSomeData(valueSelect.value, valueEditInput.value[valueSelect.value], value.value);
    const data_value = Object.values(data.data);
    const data_header = Object.keys(data.data);
    dataSource.value = [];
    // data_value是一个类，内容是二维数组，他的行号是data_header的下标，列号是每个data_header的值，把每一行的值赋给data_source
    let rowlen = 0;
    for (let i = 0; i < data_value.length; i++) {
      for (let j = 0; j < 1; j++) {
        rowlen = data_value[i].length;
      }
    }
    for (let i = 0; i < rowlen; i++) {
      const data_source = {};
      for (let j = 0; j < data_header.length; j++) {
        data_source[data_header[j]] = data_value[j][i];
      }
      dataSource.value.push(data_source);
    }
    showModal.value = false;
  }
}
const closeModal = () => {
  showModal.value = false;
};

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

// const editData = ref<UserManagement.Data | null>(null);

// function setEditData(data: UserManagement.Data | null) {
//   editData.value = data;
// }

// function handleAddTable() {
//   openModal();
//   setModalType('add');
// }

// function handleEditTable(rowId: string) {
//   const findItem = tableData.value.find(item => item.index === rowId);
//   if (findItem) {
//     setEditData(findItem);
//   }
//   setModalType('edit');
//   openModal();
// }

async function handleDeleteTable(rowId: number) {
  await fetchDatadel(rowId);
  getData();
  window.$message?.info(`该数据已删除`);
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
  getDataName();
  getData();
}

// 初始化
init();
</script>

<style scoped></style>
