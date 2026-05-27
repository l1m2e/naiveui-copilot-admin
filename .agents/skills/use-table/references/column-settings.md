# 列设置持久化

## 启用列设置

使用 `columnSettings` 选项启用列可见性/顺序设置 UI：

```ts
const { Table } = useTable({
  api: api.userGetList,
  columns,
  columnSettings: 'user-table-settings',  // localStorage 持久化键名
})
```

## columnSettings 选项

| 值 | 说明 |
|---|------|
| `false`（默认） | 不启用列设置功能 |
| `true` | 启用列设置 UI，但不持久化 |
| `字符串` | 启用列设置 UI 并使用指定键名持久化到 localStorage |

## 使用场景

```ts
// 不需要持久化
columnSettings: true

// 需要保存用户偏好
columnSettings: 'user-list-columns'

// 不同页面使用不同 key
columnSettings: 'role-list-columns'
columnSettings: 'department-list-columns'
```

## 功能特性

- 拖拽列调整顺序
- 显示/隐藏列
- 设置自动保存到 localStorage
- 用户偏好跨会话保留

## 相关文档

- [列配置](columns.md)
