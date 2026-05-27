# 生成器指南

当使用 `useForm` 生成表单时，请遵循以下流程：

1.  **分析需求**:
    - 确定所需字段。
    - 确定数据类型 (字符串, 数字, 布尔值, 数组)。
    - 确定验证需求 (必填, 最小值/最大值)。
    - 确定上下文 (页面 vs 弹窗)。

2.  **选择模式**:
    - **页面**: 使用基础用法 (直接在模板中使用 `Form.Root`)。
    - **简单弹窗**: 使用 `useFormModal`。
    - **复杂弹窗**: 使用 `usePromiseModal` + `useForm`。

3.  **构建 Schema**:
    - 创建 `items` 数组。
    - 将字段映射到 `component` Key (例如: 布尔值 -> `n-switch`)。
    - 使用 `yup` 添加 `rule`。
    - 如果需要多列布局，添加 `grid` 类名。

4.  **生成代码**:

```tsx
<script setup lang="ts">
import { useForm } from '~/composables/useForm'
import * as yup from 'yup'

// 接口定义
interface FormData {
  field1: string
  field2: number
}

// 初始化
const [Form, form, formRef] = useForm<FormData>({
  init: { field1: '', field2: 0 }
})

// Schema 配置
const items = [
  {
    label: '标签 1',
    field: 'field1',
    component: 'n-input',
    rule: yup.string().required()
  },
  // ...
]

// 提交处理
async function onSubmit() {
  await formRef.value?.validate()
  // 提交逻辑
}
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" />
    <n-button @click="onSubmit">提交</n-button>
  </Form.Root>
</template>
```
