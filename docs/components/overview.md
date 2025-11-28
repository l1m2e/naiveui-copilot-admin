# 组件概述

本项目使用 [Naive UI](https://www.naiveui.com/) 作为组件库。

## 自动导入

所有 Naive UI 组件都已配置自动导入，可以直接使用，无需手动导入：

```vue
<template>
  <n-button type="primary">按钮</n-button>
  <n-input placeholder="请输入" />
  <n-card title="卡片标题">
    卡片内容
  </n-card>
</template>

<script setup lang="ts">
// 无需导入组件，直接使用
</script>
```

## 全局配置

在 `src/main.ts` 中配置 Naive UI 的全局主题：

```ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

## 组件文档

完整的组件文档和示例，请访问 [Naive UI 官方文档](https://www.naiveui.com/zh-CN/os-theme/components/button)。

## 常用组件

### 基础组件
- Button 按钮
- Icon 图标
- Typography 排版

### 数据录入
- Input 输入框
- Select 选择器
- DatePicker 日期选择器
- Form 表单

### 数据展示
- Table 表格
- Card 卡片
- List 列表
- Tree 树

### 反馈
- Message 消息提示
- Dialog 对话框
- Drawer 抽屉
- Modal 模态框

### 导航
- Menu 菜单
- Tabs 标签页
- Breadcrumb 面包屑

### 布局
- Layout 布局
- Grid 栅格
- Space 间距
