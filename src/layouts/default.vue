<script lang="tsx" setup>
import type { Component } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/header.vue'
import Menu from './components/menu.vue'

const { pageCaches } = storeToRefs(useTagsStroe())

/** 判断当前路由是否在 tabs 布局下 */
function isTabsLayout(route: any): boolean {
  return route.matched.some((m: any) => m.meta?.layout === 'tabs')
}

/** 缓存包装组件，使 KeepAlive include 可按 name 匹配 */
const wrapperCache = new Map<string, Component>()
function wrap(key: string, component: Component) {
  if (!wrapperCache.has(key)) {
    wrapperCache.set(key, defineComponent({ name: key, render: () => component }))
  }
  return wrapperCache.get(key)!
}
</script>

<template>
  <n-layout has-sider class="relative h-screen">
    <Menu />
    <n-layout>
      <n-layout-header class="relative h-80px">
        <Header />
      </n-layout-header>
      <n-layout-content class="h-[calc(100vh-90px)] bg-gray-50 dark:bg-slate-800">
        <router-view v-slot="{ Component: C, route }">
          <div class="p-4">
            <!-- KeepAlive 始终存活，v-if 在内部控制是否渲染子组件 -->
            <keep-alive :include="pageCaches">
              <component :is="wrap(route.fullPath, C)" v-if="!isTabsLayout(route)" :key="route.fullPath" />
            </keep-alive>
            <!-- tabs 路由不走 KeepAlive，防止多次挂载 -->
            <component :is="C" v-if="isTabsLayout(route)" :key="route.fullPath" />
          </div>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
