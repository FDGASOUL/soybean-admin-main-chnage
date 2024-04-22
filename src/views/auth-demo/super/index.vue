<template>
  <div class="h-full overflow-hidden">
    <n-card title="当前权限为：" class="h-full shadow-sm rounded-16px">
      <n-tag v-if="permissionValue === 'super'" :bordered="false" type="success"> 超级管理员</n-tag>
      <n-tag v-if="permissionValue === 'admin'" :bordered="false" type="success"> 管理员</n-tag>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { usePermission } from '@/composables';
const { permission } = usePermission();
const permissionValue = ref(permission.value);
</script>

<style scoped></style>
