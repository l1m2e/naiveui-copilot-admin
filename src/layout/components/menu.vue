<script setup lang="tsx">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { LAYOUTPROVIDE_KEY } from '../constants'

const route = useRoute()

const layoutProvide = inject(LAYOUTPROVIDE_KEY)!

const menuOptions: any = [
  {
    label: '首页',
    key: 'Index',
    name: 'Index',
    icon: 'i-carbon-home',
  },
]

function renderMenuLabel(option: any) {
  return <RouterLink to={option.name}>{option.label}</RouterLink>
}

function renderIcon(option: any) {
  return <i class={option.icon}></i>
}
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    show-trigger="arrow-circle"
    :collapsed-width="layoutProvide.sidebarCollapsedWidth"
    :width="layoutProvide.sidebarWidth"
    :collapsed="layoutProvide.sidebarCollapsed"
    @collapse="layoutProvide.sidebarCollapsed = true"
    @expand="layoutProvide.sidebarCollapsed = false"
  >
    <n-menu
      :collapsed="layoutProvide.sidebarCollapsed"
      :collapsed-width="layoutProvide.sidebarCollapsedWidth"
      :collapsed-icon-size="layoutProvide.sidebarIconSize"
      :options="menuOptions" :render-label="renderMenuLabel"
      :value="route.name" :render-icon="renderIcon"
    />
  </n-layout-sider>
</template>
