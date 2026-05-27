# 基础用法

`useForm` 最常见的用法是创建一个独立的表单页面或区块。

## 初始化设置

```tsx
<script setup lang="ts">
import { useForm } from '~/composables/useForm'

// 1. 定义数据接口
interface UserForm {
  name: string
  age: number | null
}

// 2. 初始化 hook
// 返回值: Form 组件对象, 响应式数据对象, 表单实例 ref
const [Form, form, formRef] = useForm<UserForm>({
  // 可选: 设置初始值
  init: {
    name: '',
    age: null
  }
})

// 3. 定义 Schema
const items = [
  {
    label: '姓名',
    field: 'name',
    component: 'n-input',
    rule: yup.string().required()
  },
  {
    label: '年龄',
    field: 'age',
    component: 'n-input-number'
  }
]

async function handleSubmit() {
  // 验证
  await formRef.value?.validate()
  // 提交数据
  console.log(form.value)
}
</script>

<template>
  <!-- 4. 渲染 Form.Root -->
  <Form.Root label-placement="left">
    <!-- 5. 渲染 Form.ItemGrid -->
    <Form.ItemGrid :items="items" class="grid-cols-2 gap-4" />

    <n-button type="primary" @click="handleSubmit">提交</n-button>
  </Form.Root>
</template>
```

## 核心组件

### `Form.Root`

`NForm` 的包装器。接收所有 `NForm` 的属性（例如 `label-placement`, `label-width`, `disabled`, `size`）。

```html
<Form.Root label-placement="left" label-width="100" :disabled="isSubmitting">
  <!-- 内容 -->
</Form.Root>
```

### `Form.ItemGrid`

渲染 Schema 中定义的表单项。

- **items**: `FormItemProps[]` - Schema 数组。
- **class**: `string` - Grid 容器的 Tailwind 类名（例如 `grid-cols-3`）。

```html
<Form.ItemGrid :items="items" class="grid-cols-1 md:grid-cols-2" />
```
