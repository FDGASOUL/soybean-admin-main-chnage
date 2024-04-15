<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <hover-container class="px-12px" :inverted="theme.header.inverted">
      <!-- <icon-local-avatar class="text-32px" /> -->
      <n-avatar
        round
        :style="{
          color: 'yellow',
          backgroundColor: 'red'
        }"
      >
        孟
      </n-avatar>
      <span class="pl-8px text-16px font-medium">{{ auth.userInfo.userName }}</span>
    </hover-container>
  </n-dropdown>
</template>

<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui';
import { routeName } from '@/router';
import { useAuthStore, useThemeStore } from '@/store';
import { useIconRender } from '@/composables';
import { useRouterPush } from '@/composables';

const { routerPush } = useRouterPush();
defineOptions({ name: 'UserAvatar' });

const auth = useAuthStore();
const theme = useThemeStore();
const { iconRender } = useIconRender();

const options: DropdownOption[] = [
  {
    label: '用户中心',
    key: 'user-center',
    icon: iconRender({ icon: 'carbon:user-avatar' })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: iconRender({ icon: 'carbon:logout' })
  }
];

type DropdownKey = 'user-center' | 'logout';

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  if (key === 'logout') {
    window.$dialog?.info({
      title: '提示',
      content: '您确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        auth.resetAuthStore();
      }
    });
  } else if (key === 'user-center') {
    routerPush({ name: routeName('management_auth'), query: { name: 'abc' }, hash: '#DEMO_HASH' });
  }
}

</script>

<style scoped></style>
