<template>
</template>

<script lang="ts" setup>
interface Emits {
  (e: 'login', param: { userName: string; password: string }): void;
}

const emit = defineEmits<Emits>();

const accounts = [
  {
    label: '超级管理员',
    userName: 'Super',
    password: 'super123'
  },
  {
    label: '管理员',
    userName: 'Admin',
    password: 'admin123'
  },
  {
    label: '普通用户',
    userName: 'User01',
    password: 'user01123'
  }
];

function login(userName: string, password: string) {
  emit('login', { userName, password });
}
</script>

<style scoped></style>
