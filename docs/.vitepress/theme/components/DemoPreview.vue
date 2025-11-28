<script setup lang="ts">
import { ElementPlusContainer } from '@vitepress-demo-preview/component'

/**
 * DemoPreview 包装组件
 *
 * 二次封装 ElementPlusContainer，添加 vp-raw 类来隔离 VitePress 样式
 * 配合 postcssIsolateStyles 使用，防止 VitePress 默认样式影响组件库演示
 *
 * @see https://vitepress.dev/guide/markdown#raw
 */
</script>

<template>
  <div class="vp-raw">
    <ElementPlusContainer v-bind="$attrs">
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </ElementPlusContainer>
  </div>
</template>

<style scoped>
/**
 * vp-raw 类会被 postcssIsolateStyles 识别
 * 内部内容不会受到 VitePress .vp-doc 样式的影响
 */
.vp-raw {
  all: revert;
}
</style>
