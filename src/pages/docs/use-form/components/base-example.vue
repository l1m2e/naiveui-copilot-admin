<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'

const [Form, form, formRef] = useForm<Record<string, any>>()

const items: FormItemProps[] = [
  { label: '用户名', field: 'username', component: 'n-input', value: '张三' },
  { label: '年龄', field: 'age', component: 'n-input-number' },
]

defineExpose({
  Form,
  form,
  formRef,
})
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="grid-cols-2" />
  </Form.Root>
</template>
