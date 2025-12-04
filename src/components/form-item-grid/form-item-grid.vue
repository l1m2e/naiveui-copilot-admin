<script lang="ts" setup>
import type { FormItemGridProps } from '.'

const { items = [] } = defineProps<FormItemGridProps>()
</script>

<template>
  <div class="gap-2 grid">
    <div v-for="(item) in items" :key="item.field" :class="item.class">
      <form-item v-bind="item" />
    </div>
  </div>
</template>
