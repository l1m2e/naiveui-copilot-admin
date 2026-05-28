<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui'
import type { FormItemProps } from '.'
import { cloneDeep, isFunction, isString } from 'es-toolkit'
import { get, set, unset } from 'es-toolkit/compat'
import { NFormItem } from 'naive-ui'
import { formInjectionKey } from 'naive-ui/lib/form/src/context'
import { isVNode } from 'vue'
import { AUTOMATIC_COLLECTION_SCHEMA_KEY } from '~/composables/useForm'
import { FORM_ITEM_COMPONENT_MAP } from '~/constants'
import { yupToRule } from '~/utils/form-validation'

const props = defineProps<FormItemProps>()
const NForm = inject(formInjectionKey, null)!

const slots = computed(() => ({ ...useSlots(), ...props.slots }))
const FormItem = isString(props.component) ? FORM_ITEM_COMPONENT_MAP[props.component].component : props.component
const modValueKey = isString(props.component) ? FORM_ITEM_COMPONENT_MAP[props.component].modelValue : 'modelValue'
const defaultValue = isString(props.component) ? cloneDeep(FORM_ITEM_COMPONENT_MAP[props.component].defaultValue) : undefined

const itemProps = computed(() => {
  const componentProps = isFunction(props.props) ? props.props(NForm.props.model) : props.props
  return isFunction(props.component)
    ? { form: NForm.props.model, ...componentProps, field: props.field }
    : componentProps
})

// 将 Yup schema 转换为 naive-ui rule
const normalizedRule = computed<FormItemRule | FormItemRule[] | undefined>(() => {
  if (!props.rule)
    return undefined
  // 传入字段名与整个 form model，使得 yup.ref 能正确引用同级字段（如确认密码）
  return yupToRule(props.rule, props.field, NForm.props.model)
})

// // 组件创建 通过 value 生成默认值
set(NForm.props.model, props.field!, get(NForm.props.model, props.field!) ?? props.value ?? defaultValue)

// 注册单个 item 到 useForm
const formContext = inject(AUTOMATIC_COLLECTION_SCHEMA_KEY)

onMounted(() => {
  if (formContext && props.field) {
    formContext?.collect(props)
  }
})

onBeforeUnmount(() => {
  // 清理默认值 组件卸载或者隐藏自动清理数据
  unset(toValue(NForm.props.model), props.field!)
  if (formContext && props.field) {
    formContext?.release(props.field)
  }
})

const value = computed({
  get: () => get(NForm.props.model, props.field!),
  set: val => set(NForm.props.model, props.field!, val),
})

const innerComponentRef = ref()

defineExpose({
  innerComponentRef,
})
</script>

<template>
  <component
    :is="(props.label || props.field) ? NFormItem : 'div'"
    :path="props.field"
    :rule="normalizedRule"
    v-bind="props.formItemProps"
  >
    <!-- 动态 label -->
    <template v-if="props.label" #label>
      <component :is="props.label" v-if="isVNode(props.label) || isFunction(props.label)" />
      <span v-else>{{ props.label }}</span>
    </template>
    <FormItem ref="innerComponentRef" v-bind="itemProps" v-model:[modValueKey]="value">
      <template v-for="(slot, key) in slots" #[key] :key="key">
        <component :is="slot" v-bind="{ form: NForm.props.model }" />
      </template>
    </FormItem>
  </component>
</template>

<style scoped>
:deep(.n-input),
:deep(.n-input-number),
:deep(.n-select),
:deep(.n-date-picker),
:deep(.n-time-picker),
:deep(.n-cascader) {
  width: 100%;
}
</style>
