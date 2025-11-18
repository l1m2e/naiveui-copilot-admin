<script lang="ts" setup>
import { storeToRefs } from 'pinia'

definePage({
  meta: {
    title: '测试 A',
    icon: 'i-carbon-flash-filled',
    order: 1,
    permissions: [
      { label: '测试按钮A', value: 'test:add' },
    ],
  },
})

const { tagsList, currentTag } = storeToRefs(useTagsStroe())
</script>

<template>
  132
</template>
