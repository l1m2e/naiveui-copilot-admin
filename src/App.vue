<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { dateZhCN, zhCN } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: '8px',
    borderRadiusSmall: '8px',
  },
}
</script>

<template>
  <n-config-provider :date-locale="dateZhCN" :locale="zhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <main font-sans>
        <router-view />
      </main>
    </n-message-provider>
  </n-config-provider>
</template>
