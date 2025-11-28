<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

const message = useMessage()

/** 模拟远程唯一性校验 - 这些用户名已被占用 */
const takenUsernames = ['admin', 'root', 'test', 'super']

function checkUsernameUnique(username: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(!takenUsernames.includes(username.toLowerCase()))
    }, 600)
  })
}

const [Form, _form, formRef] = useForm()

const items: FormItemProps[] = [
  {
    label: '用户名（唯一性校验）',
    field: 'username',
    component: 'n-input',
    props: {
      placeholder: '尝试输入: admin, root, test, super',
    },
    rule: yup.string()
      .required('用户名为必填项')
      .min(3, '用户名至少3个字符')
      .test(
        'unique',
        '用户名已被占用',
        async (value) => {
          if (!value) return true
          return await checkUsernameUnique(value)
        },
      ),
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'n-input',
    rule: yup.string().email('请输入正确的邮箱格式').required('邮箱为必填项'),
  },
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    message.success('表单验证通过！可以提交')
  }
  catch {
    message.error('请检查表单填写')
  }
}
</script>

<template>
  <div class="space-y-4">
    <n-alert type="info" title="提示" class="mb-4">
      输入 admin、root、test 或 super 会触发异步验证失败（模拟用户名已存在）
    </n-alert>

    <Form.Root>
      <Form.ItemGrid :items="items" class="grid-cols-1" />
      <n-space class="mt-4">
        <n-button type="primary" @click="handleSubmit">
          提交
        </n-button>
      </n-space>
    </Form.Root>
  </div>
</template>
