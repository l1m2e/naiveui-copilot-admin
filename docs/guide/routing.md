# 路由配置

本项目使用 [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) 实现基于文件系统的路由。

## 基础用法

在 `src/pages/` 目录下创建 `.vue` 文件，路由会自动生成。

### 基础路由

```
src/pages/
├── index.vue       → /
├── about.vue       → /about
└── contact.vue     → /contact
```

### 嵌套路由

使用文件夹创建嵌套路由：

```
src/pages/
├── users/
│   ├── index.vue   → /users
│   └── [id].vue    → /users/:id
```

### 动态路由

使用 `[param]` 语法创建动态路由参数：

```vue
<!-- src/pages/users/[id].vue -->
<script setup lang="ts">
const route = useRoute('/users/[id]')
// route.params.id 可以访问动态参数
</script>
```

## 路由元信息

使用 `<route>` 块定义路由元信息：

```vue
<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
  title: 用户中心
</route>

<script setup lang="ts">
// 组件代码
</script>
```

## 布局系统

使用 `vite-plugin-vue-layouts` 管理布局：

```vue
<route lang="yaml">
meta:
  layout: admin
</route>
```

创建布局文件 `src/layouts/admin.vue`：

```vue
<template>
  <div class="admin-layout">
    <nav><!-- 导航 --></nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
```

## 编程式导航

```ts
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航到指定路由
router.push('/about')
router.push({ name: 'about' })
router.push({ path: '/users/123' })
```
