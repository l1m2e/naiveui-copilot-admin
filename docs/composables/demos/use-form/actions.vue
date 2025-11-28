<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

const message = useMessage()
const [Form, form, formRef] = useForm()

const items: FormItemProps[] = [
  {
    label: '昵称',
    field: 'nickname',
    component: 'n-input',
    value: '小明',
    rule: yup.string().required('昵称为必填项').min(2, '昵称至少2个字符'),
  },
  {
    label: '年龄',
    field: 'age',
    component: 'n-input-number',
    value: 18,
    rule: yup.number().required('年龄为必填项').min(1, '年龄必须大于0'),
  },
  {
    label: '启用',
    field: 'enabled',
    component: 'n-switch',
    value: true,
  },
]

async function handleValidate() {
  await formRef.value?.validate()
  message.success('验证通过！')
}

function handleReset() {
  formRef.value?.reset()
  message.info('表单已重置到初始值')
}

function handleClear() {
  Object.keys(form.value).forEach((key) => {
    form.value[key] = null
  })
  formRef.value?.restoreValidation()
  message.info('表单已清空')
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    message.success('提交成功！')
  }
  catch {
    message.error('请检查表单填写')
  }
}
</script>

<template>
  <div class="space-y-4">
    <Form.Root>
      <Form.ItemGrid :items="items" class="grid-cols-2" />

      <n-space class="mt-4">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <div class="i-lucide-send" />
          </template>
          提交
        </n-button>
        <n-button @click="handleValidate">
          <template #icon>
            <div class="i-lucide-check-circle" />
          </template>
          验证
        </n-button>
        <n-button @click="handleReset">
          <template #icon>
            <div class="i-lucide-rotate-ccw" />
          </template>
          重置
        </n-button>
        <n-button @click="handleClear">
          <template #icon>
            <div class="i-lucide-x-circle" />
          </template>
          清空
        </n-button>
      </n-space>
    </Form.Root>
  </div>
</template>
