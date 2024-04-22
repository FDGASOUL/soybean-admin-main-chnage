<template>
  <div
    class="flex-col-center h-120px p-12px border-1px border-#efeff5 dark:border-#ffffff17 rounded-4px hover:shadow-sm cursor-pointer"
    @click="handleToTab(label)"
  >
    <SvgIcon :icon="icon" :style="{ color: iconColor }" class="text-30px" />
    <p class="py-8px text-16px">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardWorkbenchMainShortcutsCard' });
import { routeName } from '@/router';
import { useRouterPush } from '@/composables';
const { routerPush } = useRouterPush();
interface Props {
  /** 快捷操作名称 */
  label: string;
  /** 图标 */
  icon: string;
  /** 图标颜色 */
  iconColor: string;
}

function handleToTab(lable) {
  if (lable === '数据分布') {
    routerPush({ name: routeName('distribution_one') });
  } else if (lable === '关联关系') {
    routerPush({ name: routeName('association') });
  } else if (lable === '消费特点分析') {
    routerPush({ name: routeName('behavior_feature') });
  } else if (lable === '消费画像') {
    routerPush({ name: routeName('behavior_draw') });
  } else if (lable === '数据管理') {
    routerPush({ name: routeName('management_role') });
  } else {
    routerPush({ name: routeName('management_auth') });
  }
}
defineProps<Props>();
</script>

<style scoped></style>
