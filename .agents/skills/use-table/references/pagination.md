# 分页

## 启用分页

设置 `pagination: true` 启用分页功能。API 需返回 `{ rows: [], total: number }` 格式。

```ts
const { Table, paginationConfig, getList } = useTable({
  api: api.userGetList,
  columns,
  pagination: true,
})
```

paginationConfig 包含分页状态：

```ts
const { paginationConfig } = useTable({
  api: api.userGetList,
  columns,
  pagination: true,
})

// paginationConfig.value = { page: 1, pageSize: 10, pageCount: 10, itemCount: 100 }
```

## 自定义数据字段

当 API 返回格式不同时，使用 `dataField` 和 `totalField` 自定义路径：

```ts
// API 返回: { data: { users: [...], totalCount: 100 } }
const { list } = useTable({
  api: fetchUsers,
  pagination: true,
  dataField: 'data.users',      // 数据路径
  totalField: 'data.totalCount', // 总数字段
})
```

## 延迟加载

设置 `immediate: false` 阻止组件挂载时自动请求：

```ts
const { Table, getList } = useTable({
  api: api.systemGetUploadFileHistoryList,
  pagination: true,
  immediate: false,  // 不自动请求
})

// 手动触发
function openModal() {
  show.value = true
  getList()  // 用户打开弹窗时才加载
}
```

## 分页参数

API 会自动接收分页参数：

```ts
// 请求参数
{
  page: 1,        // 当前页
  pageSize: 10,   // 每页数量
  keyword: '',    // 查询条件
  sortField: '',  // 排序字段
  sortOrder: '',  // 排序方式
  filters: {},    // 筛选条件
}
```

## 相关文档

- [配置选项](options.md)
- [排序](sorting.md)
- [筛选](filtering.md)
