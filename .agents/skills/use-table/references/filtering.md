# 筛选

## 启用筛选

在列配置中添加 `filter: true` 和 `filterOptions` 启用筛选功能：

```ts
const columns = [
  {
    title: '姓名',
    key: 'name',
    filter: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' },
      { label: '赵六', value: '赵六' },
    ],
  },
  { title: '部门', key: 'department' },
]
```

## 默认筛选值

设置 `defaultFilterOptionValues` 指定默认选中项：

```ts
const columns = [
  {
    title: '姓名',
    key: 'name',
    filter: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
    ],
    defaultFilterOptionValues: ['张三'],  // 默认选中张三
  },
]
```

## 后端参数

筛选时，API 会收到 `filters` 参数：

```ts
// 单选筛选
{
  filters: {
    name: '张三',
  },
}

// 多选筛选
{
  filters: {
    name: ['张三', '李四'],
  },
}
```

## 筛选状态

通过 `filterState` 获取当前筛选状态：

```ts
const { filterState } = useTable({
  api: api.user columns,
})

//GetList,
  filterState = { name: ['张三'] }
```

## 相关文档

- [列配置](columns.md)
- [排序](sorting.md)
