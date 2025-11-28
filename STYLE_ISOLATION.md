# VitePress 样式隔离方案

## 问题背景

在 VitePress 文档中使用 Naive UI（或其他 UI 组件库）时，VitePress 的默认样式（特别是 `.vp-doc` 下的 `table` 样式）会污染组件库的样式，导致组件显示异常。

## 解决方案

本项目使用 **VitePress 官方推荐的 `postcssIsolateStyles` 插件**来隔离样式，这是最简单有效的方案。

### 方案原理

`postcssIsolateStyles` 插件会自动为 VitePress 的样式添加 `:not(.vp-raw)` 选择器，使这些样式只影响不带 `.vp-raw` class 的元素。

**转换前：**
```css
.vp-doc table {
  border-collapse: collapse;
}
```

**转换后：**
```css
.vp-doc:not(.vp-raw) table {
  border-collapse: collapse;
}
```

这样，只要给元素添加 `vp-raw` class，就可以阻止 VitePress 样式的污染。

## 已完成的配置

### 1. 安装 PostCSS

```bash
pnpm add -D postcss
```

### 2. 创建 PostCSS 配置文件

文件：`docs/postcss.config.mjs`

```js
import { postcssIsolateStyles } from 'vitepress'

export default {
  plugins: [
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/, /base\.css/],
    }),
  ],
}
```

### 3. 配置主题样式

文件：`docs/.vitepress/theme/style.css`

为 `demo-preview` 容器自动应用样式隔离，确保组件演示不受影响。

## 使用方法

### 方式一：使用现有的 `<preview>` 标签（推荐）

已自动配置，无需额外操作：

```md
<preview path="./demos/use-table/basic.vue"></preview>
```

### 方式二：手动使用 `::: raw` 容器

如果需要在 Markdown 中直接写组件，可以使用 raw 容器：

```md
::: raw
<NButton type="primary">按钮</NButton>
:::
```

### 方式三：直接使用 `vp-raw` class

在自定义 Vue 组件中：

```vue
<template>
  <div class="vp-raw">
    <NDataTable :columns="columns" :data="data" />
  </div>
</template>
```

## 优势对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **postcssIsolateStyles**（当前） | ✅ 官方推荐<br>✅ 配置简单<br>✅ 自动生效<br>✅ 无需修改现有代码 | ⚠️ 需要安装 postcss |
| CSS 覆盖 | ✅ 无额外依赖 | ❌ 需要手动编写大量样式<br>❌ 维护成本高<br>❌ 可能遗漏 |
| whyframe | ✅ 完全隔离 | ❌ 配置复杂<br>❌ 性能开销<br>❌ 需要大量改动 |

## 参考资源

- [VitePress 官方文档 - Raw Container](https://vitepress.dev/guide/markdown#raw)
- [postcssIsolateStyles API](https://vitepress.dev/guide/markdown#advanced-configuration)
- [VitePress Issue #3523 - Table Style 问题](https://github.com/vuejs/vitepress/issues/3523)

## 常见问题

### Q: 为什么还是有样式问题？

A: 确保开发服务器已重启，PostCSS 配置需要重新构建才能生效。

### Q: 能否禁用某些特定样式的隔离？

A: 可以通过修改 `postcss.config.mjs` 中的 `includeFiles` 选项来控制哪些文件需要隔离。

### Q: Element Plus 也适用吗？

A: 是的，这是通用方案，适用于所有 UI 组件库（Element Plus、Ant Design Vue、Naive UI 等）。
