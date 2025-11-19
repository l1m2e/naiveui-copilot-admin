<script lang="ts" setup>
import type { FormItemProps } from '.'
import { isFunction, isString } from 'es-toolkit'
import { NFormItem } from 'naive-ui'
import { formInjectionKey } from 'naive-ui/lib/form/src/context'
import { isVNode } from 'vue'
import { FORM_ITEM_COMPONENT_MAP } from '~/constants'

const props = defineProps<FormItemProps>()
const NForm = inject(formInjectionKey, null)!

const slots = computed(() => ({ ...useSlots(), ...props.slots }))
const FormItem = isString(props.component) ? FORM_ITEM_COMPONENT_MAP[props.component].component : props.component
const modValueKey = isString(props.component) ? FORM_ITEM_COMPONENT_MAP[props.component].modelValue : 'modelValue'

const itemProps = computed(() => {
  const componentProps = isFunction(props.props) ? props.props(NForm.props.model) : props.props
  return isFunction(props.component)
    ? { form: NForm.props.model, ...componentProps, field: props.field }
    : componentProps
})

// 组件创建 通过 value 生成默认值
if (props.value !== undefined && props.value !== null) {
  toValue(NForm.props.model)[props.field!] = props.value
}

onBeforeUnmount(() => {
  // 清理默认值 组件卸载或者隐藏自动清理数据
  delete toValue(NForm.props.model)[props.field!]
})
</script>

<template>
  <component
    :is="(props.label || props.field) ? NFormItem : 'div'"
    :path="props.field"
    :rules="props.rule"
    v-bind="props.formItemProps"
  >
    <!-- 动态 label -->
    <template v-if="props.label" #label>
      <component :is="props.label" v-if="isVNode(props.label) || isFunction(props.label)" />
      <span v-else>{{ props.label }}</span>
    </template>

    <FormItem v-bind="itemProps" v-model:[modValueKey]="NForm.props.model[props.field!]">
      <template v-for="(slot, key) in slots" #[key] :key="key">
        <component :is="slot" v-bind="{ form: NForm.props.model }" />
      </template>
    </FormItem>
  </component>
</template>
