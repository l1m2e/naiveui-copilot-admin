<script lang="ts" setup>
import type { FormItemGridProps } from '.'
import { isFunction } from 'es-toolkit'
import { formInjectionKey } from 'naive-ui/lib/form/src/context'

const { items = [] } = defineProps<FormItemGridProps>()
const NForm = inject(formInjectionKey, null)!

function toVisible(v?: boolean | ((form: Record<string, any>) => boolean) | ComputedRef<boolean>) {
  if (v === undefined) return true
  return isFunction(v) ? v(NForm.props.model) : toValue(v)
}
</script>

<template>
  <div class="gap-2 grid">
    <template v-for="(item) in items" :key="item.field">
      <div v-if="toVisible(item.if)" v-show="toVisible(item.show)" :class="item.class">
        <form-item v-bind="item" />
      </div>
    </template>
  </div>
</template>
