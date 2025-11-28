<script setup lang="ts">
import { darkTheme, dateZhCN, NConfigProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

// 根据 VitePress 的夜间模式状态切换 Naive UI 主题
const theme = computed(() => isDark.value ? darkTheme : null)
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <NMessageProvider>
      <NNotificationProvider>
        <Layout />
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
