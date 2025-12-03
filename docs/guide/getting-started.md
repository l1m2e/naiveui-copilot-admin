# 快速开始

## 简介

Dietary CMS Frontend 是一个面向后台管理系统和 CMS 应用的 Vue 3 前端开发框架。它基于 [Vitesse](https://github.com/antfu/vitesse) 和 [Naive UI](https://www.naiveui.com/)，提供了声明式的表单和表格管理解决方案，让你可以快速构建现代化的后台管理系统。

## 特性

- ⚡️ [Vite](https://vitejs.dev/) - 极速的开发服务器和构建工具
- 🖖 [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- 🎨 [Naive UI](https://www.naiveui.com/) - 完整的 Vue 3 组件库
- 🛣️ [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) - 基于文件系统的路由
- 📦 [pinia](https://pinia.vuejs.org/) - 直观、类型安全的状态管理
- 🎭 [UnoCSS](https://unocss.dev/) - 即时按需的原子化 CSS 引擎
- 🔥 完整的 TypeScript 支持

## 安装

### 前置要求

- Node.js >= 18
- pnpm >= 8

### 克隆项目

```bash
git clone <项目地址>
cd diettary-cms-forntend
```

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:3333` 启动。

## 构建生产版本

```bash
pnpm build
```

构建产物将生成在 `dist` 目录下。

## 预览生产版本

```bash
pnpm preview
```
