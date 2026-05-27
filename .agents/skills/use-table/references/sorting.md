# 排序

## 启用排序

在列配置中添加 `sorter: true` 启用排序功能：

```ts
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  {
    title: '年龄',
    key: 'age',
    sorter: true,  // 启用排序
  },
  { title: '邮箱', key: 'email' },
]
```

## 默认排序

设置 `defaultSortOrder` 指定默认排序：

```ts
const columns = [
  {
    title: '年龄',
    key: 'age',
    sorter: true,
    defaultSortOrder: 'ascend',  // 默认升序
  },
]
```

## 多列排序

useTable 默认启用多列排序（`allow-sorter-multiple`）：

```ts
const columns = [
  {
    title: '部门',
    key: 'department',
    sorter: true,
  },
  {
    title: '姓名',
    key: 'name',
    sorter: true,
  },
]
```

## 后端参数

排序时，API 会收到以下参数：

```ts
// 单列排序
{
  sortField: 'age',
  sortOrder: 'asc',  // 'asc' 或 'desc'
}

// 多列排序
{
  sorts: [
    { field: 'department', order: 'asc' },
    { field: 'name', order: 'desc' },
  ],
}
```

## 排序状态

通过 `sortState` 获取当前排序状态：

```ts
const { sortState } = useTable({
  api: api.userGetList,
  columns,
})

// sortState = { columnKey: 'age', order: 'ascend' }
```

## 相关文档

- [列配置](columns.md)
- [筛选](filtering.md)
