<template>
  <div class="h-full overflow-hidden">
    <n-card title="当前权限为：" class="h-full shadow-sm rounded-16px">
      <n-tag :bordered="false" type="success"> 超级管理员</n-tag>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
// import { reactive, ref } from 'vue';
// import type { Ref } from 'vue';
// import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
// import type { DataTableColumns, PaginationProps } from 'naive-ui';
// import { genderLabels, userStatusLabels } from '@/constants';
// import { fetchUserList, fetchUserdel, fetchUserdels } from '@/service';
// import { useAuthStore } from '@/store';
// import { useBoolean, useLoading } from '@/hooks';
// import TableActionModal from './components/table-action-modal.vue';
// import type { ModalType } from './components/table-action-modal.vue';
// import ColumnSetting from './components/column-setting.vue';
// import type { UserManagement } from '~/src/typings/business';

// const auth = useAuthStore();
// const Role = auth.userInfo.userRole === 'super' ? 1 : 2;
// console.log(Role)
// import { onMounted, ref } from 'vue';
// import { NSpace, NButton, NPopconfirm } from 'naive-ui';
// import type { DataTableColumn } from 'naive-ui';
// import { useLoadingEmpty } from '@/hooks';
// import { getRandomInteger } from '@/utils';

// interface DataSource {
//   userName: string;
//   id: number;
//   status: string;
// }

// const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

// const columns: DataTableColumn[] = [
//   {
//     title: '用户名',
//     key: 'userName',
//     align: 'center'
//   },
//   {
//     title: '用户ID',
//     key: 'id',
//     align: 'center'
//   },
//   {
//     title: '用户身份',
//     key: 'status',
//     align: 'center'
//   },
//   {
//     key: 'action',
//     title: '操作',
//     align: 'center',
//     render: () => {
//       return (
//         <NSpace justify={'center'}>
//           <NButton size={'small'} onClick={() => {}}>
//             编辑
//           </NButton>
//           <NPopconfirm onPositiveClick={() => {}}>
//             {{
//               default: () => '确认删除',
//               trigger: () => <NButton size={'small'}>删除</NButton>
//             }}
//           </NPopconfirm>
//         </NSpace>
//       );
//     }
//   }
// ];

// const dataSource = ref<DataSource[]>([]);

// function createDataSource(): DataSource[] {
//   return Array(100)
//     .fill(1)
//     .map((_item, index) => {
//       return {
//         userName: `Name${index}`,
//         id: getRandomInteger(30, 20),
//         status: '中国'
//       };
//     });
// }

// function getDataSource() {
//   startLoading();
//   setTimeout(() => {

//     dataSource.value = createDataSource();
//     endLoading();
//     setEmpty(!dataSource.value.length);
//   }, 1000);
// }

// function getEmptyDataSource() {
//   startLoading();
//   setTimeout(() => {
//     dataSource.value = [];
//     endLoading();
//     setEmpty(!dataSource.value.length);
//   }, 1000);
// }

// onMounted(() => {
//   getDataSource();
// });
</script>

<style scoped></style>
