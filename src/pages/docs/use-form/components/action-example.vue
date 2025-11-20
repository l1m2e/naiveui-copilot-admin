<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

const [Form, form, formRef] = useForm<Record<string, any>>()
const items: FormItemProps[] = [
  { label: '昵称', field: 'nick', component: 'n-input', rule: yup.string().required('必填') },
]

function resetForm() {
  Object.keys(form.value).forEach(k => (form.value[k] = undefined))
}

defineExpose({
  Form,
  form,
  formRef,
  resetForm,
})
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="grid-cols-2" />
  </Form.Root>
</template>
