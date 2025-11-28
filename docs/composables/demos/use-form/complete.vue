<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

interface UserForm {
  username: string
  email: string
  age: number
  gender: string
  hobbies: string[]
  description: string
  enabled: boolean
  rating: number
}

const message = useMessage()
const [Form, _form, formRef] = useForm<UserForm>()

const items: FormItemProps[] = [
  {
    label: '用户名',
    field: 'username',
    component: 'n-input',
    rule: yup.string().required('用户名为必填项').min(3, '至少3个字符'),
    formItemProps: { class: 'col-span-2' },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'n-input',
    rule: yup.string().email('邮箱格式不正确').required('邮箱为必填项'),
    formItemProps: { class: 'col-span-2' },
  },
  {
    label: '年龄',
    field: 'age',
    component: 'n-input-number',
    props: { min: 1, max: 150 },
    rule: yup.number().required('年龄为必填项').min(1, '年龄必须大于0'),
  },
  {
    label: '性别',
    field: 'gender',
    component: 'n-select',
    props: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' },
      ],
    },
    rule: yup.string().required('请选择性别'),
  },
  {
    label: '爱好',
    field: 'hobbies',
    component: 'n-dynamic-tags',
    formItemProps: { class: 'col-span-2' },
  },
  {
    label: '评分',
    field: 'rating',
    component: 'n-rate',
    value: 0,
  },
  {
    label: '启用状态',
    field: 'enabled',
    component: 'n-switch',
    value: true,
  },
  {
    label: '个人简介',
    field: 'description',
    component: 'n-input',
    props: { type: 'textarea', rows: 4, placeholder: '请输入个人简介...' },
    formItemProps: { class: 'col-span-4' },
  },
]

const loading = ref(false)

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    loading.value = true
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
    message.success('提交成功！')
  }
  catch {
    message.error('请检查表单填写')
  }
}

function handleReset() {
  formRef.value?.reset()
  message.info('表单已重置')
}
</script>

<template>
  <div class="space-y-4">
    <n-card title="用户信息表单" size="small">
      <Form.Root label-placement="left" label-width="100">
        <Form.ItemGrid :items="items" class="gap-4 grid-cols-4" />

        <n-divider />

        <n-space justify="end">
          <n-button @click="handleReset">
            重置
          </n-button>
          <n-button type="primary" :loading="loading" @click="handleSubmit">
            提交
          </n-button>
        </n-space>
      </Form.Root>
    </n-card>
  </div>
</template>
