# 弹窗模式

创建表单弹窗主要有两种模式：适用于简单场景的 `useFormModal`，以及适用于复杂自定义布局的 `usePromiseModal` + `useForm`。

## 模式 A: `useFormModal` (简单)

适用于只需要在弹窗中展示一系列字段的标准表单。

```tsx
import { useFormModal } from '~/composables/useFormModal'

// 1. 定义 Schema
const schema = [
  { label: '姓名', field: 'name', component: 'n-input' }
]

// 2. 初始化
const { Modal, open } = useFormModal({
  schema,
  title: '编辑用户',
  confirmButtonText: '保存'
})

// 3. 使用
async function handleEdit(row) {
  // 打开弹窗并传入数据，确认后返回更新后的数据
  const updatedData = await open(row)
  // 调用 API 保存
}

// 4. 模板
<template>
  <Modal />
</template>
```

## 模式 B: `usePromiseModal` + `useForm` (高级)

适用于需要自定义布局（Tabs、头部、底部插槽）或复杂交互的场景。

```tsx
<script setup lang="ts">
import { assignExisting } from '~/utils'

// 1. 初始化 Form
const [Form, form, formRef] = useForm<UserType>()

// 2. 初始化 Modal
const { Modal, open, showModal, confirm } = usePromiseModal<UserType>(
  // 打开时的回调
  (data) => {
    // 填充表单数据
    assignExisting(form.value, data)
  }
)

const items = [/* ... */]

async function onConfirm() {
  await formRef.value?.validate()
  confirm(form.value) // 解析 Promise
}

defineExpose({ open })
</script>

<template>
  <Modal title="用户详情" class="w-800px">
    <Form.Root>
      <!-- 自定义布局示例 -->
      <n-tabs>
        <n-tab-pane name="basic" tab="基本信息">
          <Form.ItemGrid :items="items" />
        </n-tab-pane>
        <n-tab-pane name="extra" tab="其他信息">
           <!-- 自定义内容 -->
        </n-tab-pane>
      </n-tabs>
    </Form.Root>

    <template #footer>
      <n-button @click="showModal = false">取消</n-button>
      <n-button type="primary" @click="onConfirm">保存</n-button>
    </template>
  </Modal>
</template>
```
