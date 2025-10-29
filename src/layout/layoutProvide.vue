<script lang="ts" setup>
import { LAYOUTPROVIDE_KEY } from './constants'

const config = ref({
  sidebarCollapsed: false,
  sidebarWidth: 240,
  sidebarIconSize: 22,
  sidebarCollapsedWidth: 64,
})

provide(LAYOUTPROVIDE_KEY, config)
</script>

<template>
  <slot />
</template>
