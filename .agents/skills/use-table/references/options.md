# 配置选项

## UseTableOptions 接口

```ts
interface UseTableOptions<TApi extends ApiFunction = ApiFunction, TField extends string = 'data.list'> {
  /** 请求方法 - API 函数 */
  api: TApi

  /** 查询表单配置 - 支持静态数组或 ComputedRef */
  queryFormSchema?: FormItemProps[] | ComputedRef<FormItemProps[]>

  /** 表格列配置 */
  columns?: DataTableColumns<T>

  /** 是否启用分页 - 默认 false */
  pagination?: boolean

  /** 是否启用列设置（拖拽排序、显示/隐藏）- 默认 false */
  columnSettings?: boolean | ColumnSettingsKey

  /** 数据字段路径 - 默认 'data.list' */
  dataField?: TField

  /** 总数字段 - 默认 'data.total' */
  totalField?: string

  /** 是否立即执行 - 默认 true */
  immediate?: boolean
}
```

## 选项说明

### api

API 函数，接收查询参数，返回数据。

```ts
// 分页 API
async function fetchUsers(params: { page: number; pageSize: number; keyword?: string }) {
  return { data: { list: [...], total: 100 } }
}

// 非分页 API
async function fetchAllUsers() {
  return [...]
}

const { Table } = useTable({
  api: fetchUsers,  // 或 fetchAllUsers
  columns,
})
```

### queryFormSchema

查询表单配置，支持静态或动态生成。

```ts
// 静态配置
const queryFormSchema: FormItemProps[] = [
  { label: '名称', field: 'name', component: 'n-input' },
]

// 动态配置
const queryFormSchema = computed(() => [
  { label: '名称', field: 'name', component: 'n-input' },
])
```

### columns

表格列配置，类型为 DataTableColumns<T>。

```ts
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '名称', key: 'name' },
]
```

### pagination

是否启用分页功能。

```ts
const { Table } = useTable({
  api: api.userGetList,
  columns,
  pagination: true,  // 启用分页
})
```

### columnSettings

列设置功能，控制列的可见性和顺序。

```ts
// 不启用
columnSettings: false

// 启用 UI，不持久化
columnSettings: true

// 启用 UI，并持久化到 localStorage
columnSettings: 'user-table-settings'
```

### dataField

从 API 响应中提取数据的路径。

```ts
// 默认: 'data.list'
// API 返回: { data: { list: [...] } }

const { list } = useTable({
  api: fetchUsers,
  dataField: 'data.users',  // API 返回: { data: { users: [...] } }
})
```

### totalField

总数字段路径，用于分页。

```ts
// 默认: 'data.total'
const { paginationConfig } = useTable({
  api: fetchUsers,
  pagination: true,
  totalField: 'data.count',  // API 返回: { data: { count: 100 } }
})
```

### immediate

是否在组件挂载时立即请求数据。

```ts
// 默认: true - 挂载时自动请求
const { Table } = useTable({
  api: api.userGetList,
})

// false - 延迟加载，需手动调用 getList()
const { Table, getList } = useTable({
  api: api.userGetList,
  immediate: false,
})

// 手动触发
onMounted(() => {
  getList()
})
```

## 相关文档

- [核心 API](core-api.md)
- [查询表单](query-form.md)
- [分页](pagination.md)
