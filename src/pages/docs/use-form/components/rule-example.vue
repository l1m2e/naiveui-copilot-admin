<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

const [Form, form, formRef] = useForm<Record<string, any>>()
const items: FormItemProps[] = [
  { label: '手机号', field: 'phone', component: 'n-input', rule: yup.string().phone('请输入合法手机号').required('必填') },
  { label: '价格(正数)', field: 'price', component: 'n-input', rule: yup.string().positiveNumber(2, '请输入最多2位小数的正数').required('必填') },
  { label: '代号(数字+英文)', field: 'code', component: 'n-input', rule: yup.string().alphanumeric('只能数字或英文').required('必填') },
]

defineExpose({
  Form,
  form,
  formRef,
})
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="grid-cols-3" />
  </Form.Root>
</template>
