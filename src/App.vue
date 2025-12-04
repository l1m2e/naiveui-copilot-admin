<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'

const themeOverrides = {
  common: {
    borderRadius: '8px'
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
