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
    .filter(child => !child.path.includes(':'))
    .map(child => ({
      ...child,
      path: child.path === ''
        ? parentPath
        : child.path.startsWith('/') ? child.path : `${parentPath}/${child.path}`
    }))
    .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0))
})

watchEffect(() => {
  if (childRoutes.value.length > 0) {
    const matched = route.matched.findLast(r => r.children?.length)
    if (!matched) return

    const isDescendant = route.name !== matched.name
    const hasParams = Object.keys(route.params).length > 0
    if (isDescendant && hasParams) return

    const isMatchingChildRoute = childRoutes.value.some(child => child.path === route.path)
    if (!isMatchingChildRoute) {
      router.replace(childRoutes.value[0].path)
    }
  }
})
</script>

<template>
  <n-card class="h-full flex flex-col">
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
