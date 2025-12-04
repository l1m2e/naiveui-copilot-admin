<script lang="tsx" setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const childRoutes = computed(() => {
  const matched = route.matched.findLast(r => r.children?.length)
  if (!matched) return []

  const parentPath = matched.path
  return matched.children
    .filter(child => child.path)
    .map(child => ({
      ...child,
      path: child.path.startsWith('/') ? child.path : `${parentPath}/${child.path}`
    }))
    .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
})

// 默认重定向到第一个子路由
watchEffect(() => {
  if (childRoutes.value.length > 0) {
    const currentPath = route.path
    const firstChildPath = childRoutes.value[0].path

    // 如果当前路径不在子路由列表中，重定向到第一个子路由
    const isMatchingChildRoute = childRoutes.value.some(child => child.path === currentPath)
    if (!isMatchingChildRoute) {
      router.replace(firstChildPath)
    }
  }
})
</script>

<template>
  <n-card class="flex flex-col h-full">
    <n-tabs
      v-if="childRoutes.length > 0"
      :value="route.path"
      type="line"
      animated
      @update:value="router.push"
    >
      <n-tab-pane
        v-for="child in childRoutes"
        :key="child.path"
        :name="child.path"
        :tab="child.meta?.title || child.path"
      />
    </n-tabs>

    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </n-card>
</template>
