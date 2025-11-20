<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import { h } from 'vue'

const [Form, form, formRef] = useForm<Record<string, any>>()
const items: FormItemProps[] = [
  { label: '标题', field: 'title', component: 'n-input', formItemProps: { class: 'col-span-2' } },
  { label: '描述', field: 'desc', component: 'n-input', formItemProps: { class: 'col-span-3' } },
  { label: '上传', field: 'upload', component: 'n-upload', formItemProps: { class: 'col-span-3' }, slots: { default: () => h('span', '点击上传文件') } },
]

defineExpose({
  Form,
  form,
  formRef,
})
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="gap-4 grid-cols-3" />
  </Form.Root>
</template>
