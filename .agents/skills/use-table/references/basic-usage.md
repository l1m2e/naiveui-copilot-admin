# 基础用法

## 最简单的表格

仅展示数据的表格，无需查询表单和分页：

```vue
<script setup lang="ts">
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
]

const { Table } = useTable({
  api: api.userGetList,
  columns,
})
</script>

<template>
  <Table />
</template>
```

## 非分页模式

当 API 直接返回数组而非分页格式时：

```ts
// API 返回: [...]
const { Table, list } = useTable({
  api: api.getAllUsers,  // 返回数组的 API
  columns,
})

// list 为 Ref<User[]>
```

## 相关文档

- [核心 API](core-api.md)
- [配置选项](options.md)
