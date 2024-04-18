<template>
  <n-space :vertical="true" :size="16">
    <top-chart />
    <bottom-part />
  </n-space>
</template>

<script lang="ts" setup>
import { BottomPart, TopChart } from './components';
</script>

<style scoped></style>
