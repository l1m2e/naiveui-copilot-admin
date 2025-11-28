# 项目结构

```
vitesse-lite/
├── .vscode/              # VSCode 配置
├── public/               # 静态资源
├── src/
│   ├── assets/          # 资源文件
│   ├── components/      # 全局组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件（自动生成路由）
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   └── main.ts          # 应用入口
├── index.html           # HTML 模板
├── package.json
├── tsconfig.json        # TypeScript 配置
├── uno.config.ts        # UnoCSS 配置
└── vite.config.ts       # Vite 配置
```

## 目录说明

### `src/pages/`

页面组件目录，使用 `unplugin-vue-router` 自动生成路由。

例如：
- `src/pages/index.vue` → `/`
- `src/pages/about.vue` → `/about`
- `src/pages/users/[id].vue` → `/users/:id`

### `src/layouts/`

布局组件目录，使用 `vite-plugin-vue-layouts` 管理。

在页面中使用：
```vue
<route lang="yaml">
meta:
  layout: default
</route>
```

### `src/components/`

全局组件目录，组件会自动注册，无需手动导入。

### `src/composables/`

组合式函数目录，函数会自动导入，无需手动导入。

### `src/stores/`

Pinia 状态管理目录。
