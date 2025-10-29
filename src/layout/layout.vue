<script lang="ts" setup>
import Header from './components/header.vue'
import Menu from './components/menu.vue'
import LayoutProvide from './layoutProvide.vue'
</script>

<template>
  <LayoutProvide>
    <div class="flex h-screen">
      <Menu />
      <div class="flex flex-1 flex-col">
        <Header class="h-64px" />
        <div class="p-4 bg-gray-50 h-[calc(100vh-64px)] overflow-auto dark:bg-slate-800">
          <router-view />
        </div>
      </div>
    </div>
  </LayoutProvide>
</template>
