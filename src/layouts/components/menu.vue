<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import type { AppMenuOption } from '~/stores/useMenuStore'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'

const route = useRoute()
const { sidebarCollapsed, sidebarWidth, sidebarIconSize, sidebarCollapsedWidth } = storeToRefs(useAppStore())
const { menuTree } = storeToRefs(useMenuStore())
const { buildMenuFromRoutes } = useMenuStore()

/** 初始化菜单数据 */
buildMenuFromRoutes([...autoRoutes])

const activeKey = computed(() => (route.meta?.activeMenu as string) || route.name as string)

/** 渲染菜单名称 */
function renderMenuLabel(option: MenuOption) {
  const appOption = option as unknown as AppMenuOption
  return appOption.children?.length ? appOption.label : <RouterLink to={appOption.path}>{appOption.label}</RouterLink>
}

/** 渲染菜单图标 */
function renderIcon(option: MenuOption) {
  const appOption = option as unknown as AppMenuOption
  return !appOption.meta?.icon ? null : <div class={`${appOption.meta.icon} text-3.3`} />
}
</script>

<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    show-trigger="arrow-circle"
    :collapsed-width="sidebarCollapsedWidth"
    :width="sidebarWidth"
    :collapsed="sidebarCollapsed"
    @collapse="sidebarCollapsed = true"
    @expand="sidebarCollapsed = false"
  >
    <n-menu
      :collapsed="sidebarCollapsed"
      :collapsed-width="sidebarCollapsedWidth"
      :collapsed-icon-size="sidebarIconSize"
      :options="menuTree"
      :render-label="renderMenuLabel"
      :render-icon="renderIcon"
      :value="activeKey"
    />
  </n-layout-sider>
</template>
