<script lang="ts" setup>
import type { FormItemGridProps } from '.'

const { items = [] } = defineProps<FormItemGridProps>()
</script>

<template>
  <div class="gap-2 grid">
    <form-item
      v-for="(item, index) in items"
      :key="index"
      v-bind="item"
    />
  </div>
</template>
