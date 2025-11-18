<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import type { AppMenuOption } from '~/stores/useMenu'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '~/stores/useMenu'
import { LAYOUTPROVIDE_KEY } from '../constants'

const route = useRoute()
const router = useRouter()
const layoutProvide = inject(LAYOUTPROVIDE_KEY)!
const { menuTree } = storeToRefs(useMenuStore())
const { buildMenuFromRoutes } = useMenuStore()

/** 初始化菜单数据 */
buildMenuFromRoutes(router.options.routes)

/** 渲染菜单名称 */
function renderMenuLabel(option: MenuOption) {
  const appOption = option as unknown as AppMenuOption
  return appOption.children?.length ? appOption.label : <RouterLink to={appOption.path}>{appOption.label}</RouterLink>
}

/** 渲染菜单图标 */
function renderIcon(option: MenuOption) {
  const appOption = option as unknown as AppMenuOption
  return !appOption.mate?.icon ? null : <i class={appOption.mate.icon} />
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
      :options="menuTree"
      :render-label="renderMenuLabel"
      :render-icon="renderIcon"
      :value="route.name"
    />
  </n-layout-sider>
</template>
