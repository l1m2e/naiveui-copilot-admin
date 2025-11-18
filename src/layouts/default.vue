<script lang="tsx" setup>
import type { Component as VueComponent } from 'vue'
import { storeToRefs } from 'pinia'
import Header from './components/header.vue'
import LayoutProvide from './components/layoutProvide.vue'
import Menu from './components/menu.vue'

const { pageCaches } = storeToRefs(useTagsStroe())

// 根据路由名称自动对组件进行包装
const cacheMap = new Map<string, any>()

function wrap(name: string, component: VueComponent) {
  const cacheName = name
  if (cacheMap.has(cacheName)) {
    return cacheMap.get(cacheName)
  }

  const cache = {
    name: cacheName,
    render: () => component
  }

  cacheMap.set(cacheName, cache)
  return cache
}
</script>

<template>
  <LayoutProvide>
    <n-layout has-sider class="h-screen">
      <Menu />
      <n-layout>
        <n-layout-header class="h-80px">
          <Header />
        </n-layout-header>
        <n-layout-content class="p-4 bg-gray-50 h-[calc(100vh-90px)] dark:bg-slate-800">
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="pageCaches">
              <Component :is="wrap(route.path, Component)" :key="route.fullPath" />
            </keep-alive>
          </router-view>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </LayoutProvide>
</template>
