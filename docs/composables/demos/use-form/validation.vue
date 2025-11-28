<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

const message = useMessage()
const [Form, _form, formRef] = useForm<Record<string, any>>()

const items: FormItemProps[] = [
  {
    label: '手机号',
    field: 'phone',
    component: 'n-input',
    rule: yup.string().phone('请输入合法手机号').required('手机号为必填项'),
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'n-input',
    rule: yup.string().email('请输入正确的邮箱格式').required('邮箱为必填项'),
  },
  {
    label: '价格（正数）',
    field: 'price',
    component: 'n-input-number',
    rule: yup.string().positiveNumber(2, '请输入最多2位小数的正数').required('必填'),
  },
  {
    label: '代号（字母+数字）',
    field: 'code',
    component: 'n-input',
    rule: yup.string().alphanumeric('只能包含数字和英文字母').required('必填'),
  },
]

async function handleValidate() {
  await formRef.value?.validate()
  message.success('验证通过！')
}

function handleReset() {
  formRef.value?.reset()
  message.info('表单已重置')
}
</script>

<template>
  <div class="space-y-4">
    <Form.Root>
      <Form.ItemGrid :items="items" class="grid-cols-2" />
      <n-space class="mt-4">
        <n-button type="primary" @click="handleValidate">
          验证表单
        </n-button>
        <n-button @click="handleReset">
          重置表单
        </n-button>
      </n-space>
    </Form.Root>
  </div>
</template>
