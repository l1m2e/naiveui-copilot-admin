<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

const [Form] = useForm()

const items: FormItemProps[] = [
  { label: '用户名', field: 'username', component: 'n-input', value: '张三' },
  { label: '年龄', field: 'age', component: 'n-input-number' },
  { label: '邮箱', field: 'email', component: 'n-input' },
]
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="grid-cols-2" />
  </Form.Root>
</template>
