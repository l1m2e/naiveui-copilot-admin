<script lang="ts" setup>
import { storeToRefs } from 'pinia'

definePage({
  meta: {
    title: '测试 B',
    icon: 'i-carbon-idea',
    order: 2,
  },
})

const { permissionTree } = storeToRefs(useMenuStore())
</script>

<template>
  <n-card class="flex h-full w-full items-center justify-center">
    <span>这里是测试 B 页面</span>
    <n-tree block-line :data="permissionTree" expand-on-click checkable />
  </n-card>
</template>
