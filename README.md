# Dietary CMS Frontend

> 🚀 基于 Vue 3 + Vite + Naive UI 的现代化 CMS 前端开发框架

一个面向后台管理系统和 CMS 应用的 Vue 3 前端开发框架，提供开箱即用的表单和表格解决方案。

## ✨ 核心特性

### 🎯 声明式表单管理 (`useForm`)
- **简洁的 API** - 通过配置数组快速创建表单
- **Yup 集成** - 自动将 Yup schema 转换为 Naive UI 验证规则
- **智能重置** - 根据组件类型自动选择正确的重置值
- **22+ 组件支持** - 覆盖所有 Naive UI 表单组件
- **异步验证** - 支持远程校验（如用户名唯一性检查）
- **响应式布局** - 基于 Grid 的灵活布局系统

### 📊 集成表格管理 (`useTable`)
- **查询表单集成** - 基于 `useForm` 的查询面板
- **智能分页** - 自动处理分页逻辑
- **排序&筛选** - 内置排序和筛选支持
- **列配置持久化** - 支持列显示/隐藏、拖拽排序
- **自动刷新** - 查询、排序、筛选自动触发数据刷新

### ⚡️ 现代化开发体验
- **[Vue 3](https://vuejs.org/)** + **[Vite](https://vitejs.dev/)** - 极速的开发和构建体验
- **[Naive UI](https://www.naiveui.com/)** - 完整的 Vue 3 组件库
- **[UnoCSS](https://unocss.dev/)** - 即时按需的原子化 CSS 引擎
- **[TypeScript](https://www.typescriptlang.org/)** - 完整的类型支持
- **[Pinia](https://pinia.vuejs.org/)** - 直观、类型安全的状态管理
- **[VueUse](https://vueuse.org/)** - 实用的 Composition API 工具集

### 📦 开箱即用
- **文件路由** - 基于 `unplugin-vue-router` 的文件系统路由
- **自动导入** - 组件、Composables、API 按需自动导入
- **布局系统** - 支持多布局切换
- **图标方案** - 基于 Iconify 的纯 CSS 图标（Lucide 图标集）
- **单元测试** - Vitest + Vue Test Utils

## 📚 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 10

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```
访问 http://localhost:3333

### 构建生产版本
```bash
pnpm build
```

### 预览生产版本
```bash
pnpm preview
```

### 运行测试
```bash
pnpm test
```

### 启动文档
```bash
pnpm docs:dev
```
访问文档查看完整的 API 和示例

## 📖 技术栈

### 核心框架
- **Vue 3.5+** - 使用 `<script setup>` 语法
- **Vite 6+** - 构建工具
- **TypeScript 5+** - 类型系统

### UI 框架
- **Naive UI 2.43+** - Vue 3 组件库
- **UnoCSS** - 原子化 CSS 引擎
- **Reka UI** - 无样式 UI 组件库（用于自定义组件）

### 路由与状态
- **Vue Router 4** + **unplugin-vue-router** - 文件路由系统
- **Pinia** + **pinia-plugin-persistedstate** - 状态管理与持久化

### 表单与验证
- **Yup** - Schema 验证
- **自定义 useForm** - 声明式表单管理

### 开发工具
- **ESLint** + **@antfu/eslint-config** - 代码规范
- **Vitest** + **@vue/test-utils** - 单元测试
- **VitePress** - 文档生成
- **simple-git-hooks** + **lint-staged** - Git 钩子

## 🗂 项目结构

```
diettary-cms-forntend/
├── src/
│   ├── components/       # 公共组件
│   │   ├── form-item/    # 表单项组件
│   │   ├── form-item-grid/  # 表单网格布局
│   │   └── query-form/   # 查询表单组件
│   ├── composables/      # 组合式函数
│   ├── constants/        # 常量定义
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面（文件路由）
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   └── main.ts           # 应用入口
├── docs/                 # VitePress 文档
├── scripts/              # 脚本工具
├── public/               # 静态资源
└── package.json
```

## 🎨 特色功能

### 声明式表单示例
```vue
<script setup lang="ts">
import { useForm } from '@/composables/useForm'
import * as yup from 'yup'

const { FormItems, formData, validate } = useForm({
  items: [
    {
      label: '用户名',
      path: 'username',
      component: 'NInput',
      schema: yup.string().required('请输入用户名')
    },
    {
      label: '邮箱',
      path: 'email',
      component: 'NInput',
      schema: yup.string().email('邮箱格式不正确').required()
    }
  ]
})

async function handleSubmit() {
  if (await validate()) {
    console.log(formData)
  }
}
</script>
```

### 集成表格示例
```vue
<script setup lang="ts">
import { useTable } from '@/composables/useTable'

const { QueryForm, Table, getList } = useTable({
  columns: [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '名称' }
  ],
  queryItems: [
    {
      label: '搜索',
      path: 'keyword',
      component: 'NInput'
    }
  ],
  async onFetchData({ query, pagination }) {
    // 获取数据
    return {
      data: [],
      total: 0
    }
  }
})
</script>

<template>
  <QueryForm />
  <Table />
</template>
```

## 📝 开发规范

- 使用 ESLint 配置（@antfu/eslint-config）
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 使用 `<script setup>` 语法
- 使用 UnoCSS 原子化 CSS

## 🔧 其他脚本

```bash
# 更新依赖到最新版本
pnpm up

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 构建文档
pnpm docs:build
```
