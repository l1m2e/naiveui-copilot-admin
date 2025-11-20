<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'

/** 异步模拟：远程唯一性校验（用户名不能重复） */
const takenUsernames = ['admin', 'root', 'test', 'super']
function fakeCheckUsernameUnique(name: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟网络时延
    setTimeout(() => {
      resolve(!takenUsernames.includes(name.toLowerCase()))
    }, 600)
  })
}

const [Form, form, formRef] = useForm<Record<string, any>>()
const items: FormItemProps[] = [
  {
    label: '用户名(唯一)',
    field: 'uniqueUsername',
    component: 'n-input',
    rule: yup.string().required().test(
      'unique',
      '用户名已存在',
      async (value) => {
        if (!value) return true
        const ok = await fakeCheckUsernameUnique(value)
        return ok
      },
    ),
  },
  { label: '邮箱(示例)', field: 'email', component: 'n-input', rule: yup.string().email('邮箱格式不正确').required('必填') },
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
