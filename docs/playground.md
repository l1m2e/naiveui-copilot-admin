---
layout: page
---

<script setup lang="ts">
import { Repl } from '@vue/repl'
import '@vue/repl/style.css'
</script>

# Vue 3 Playground

在线体验 Vue 3 + Naive UI 的强大功能。

<div style="margin-top: 20px; height: 600px; border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden;">
  <Repl />
</div>

## 功能特性

- ✨ **实时预览** - 代码变更即时生效
- 🎨 **Naive UI** - 预装 Naive UI 组件库
- 🔥 **Vue 3** - 使用最新的 Vue 3 特性
- 📦 **自动导入** - Composition API 自动导入

## 使用提示

1. 在左侧编辑器中编写你的 Vue 代码
2. 可以直接使用 Naive UI 的所有组件
3. 支持 `<script setup>` 语法
4. 实时在右侧查看运行效果

## 示例代码

你可以尝试以下示例：

### 按钮示例

```vue
<template>
  <n-space>
    <n-button type="primary">主要按钮</n-button>
    <n-button type="success">成功按钮</n-button>
    <n-button type="warning">警告按钮</n-button>
  </n-space>
</template>
```

### 表单示例

```vue
<script setup>
import { ref } from 'vue'

const formValue = ref({
  name: '',
  email: '',
})
</script>

<template>
  <n-form :model="formValue">
    <n-form-item label="姓名">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
    <n-form-item label="邮箱">
      <n-input v-model:value="formValue.email" />
    </n-form-item>
  </n-form>
</template>
```
