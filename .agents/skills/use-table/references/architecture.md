# 内部架构

useTable 由以下组合式函数组成：

## 模块职责

| 模块 | 职责 | 导出文件 |
|------|------|----------|
| useSorter | 排序状态管理，转换为 API 参数 | `useSorter` |
| useFilter | 筛选状态管理，转换为 API 参数 | `useFilter` |
| useColumns | 列处理、设置 UI、持久化 | `useColumns` |
| useTableDataFetcher | 数据请求，分页/非分页逻辑处理 | `useTableDataFetcher` |
| Form 组件 | 查询表单渲染 | `Form` |

## useSorter

管理排序状态，提供排序变化处理器：

```ts
// 输入
columns: DataTableColumns<T>

// 输出
sortState: Ref<SortState | SortState[] | null>
sortParams: ComputedRef<{ sortField?: string; sortOrder?: string }>
createSorterHandler: (options) => (sorter) => void

// API 参数格式
{ sortField: 'age', sortOrder: 'asc' }
或
{ sorts: [{ field: 'dept', order: 'asc' }, { field: 'name', order: 'desc' }] }
```

## useFilter

管理筛选状态，提供筛选变化处理器：

```ts
// 输入
columns: DataTableColumns<T>

// 输出
filterState: Ref<FilterState | null>
filterParams: ComputedRef<{ filters: Record<string, any> }>
createFilterHandler: (options) => (filters) => void

// API 参数格式
{ filters: { name: ['张三', '李四'] } }
```

## useColumns

处理列配置，支持列设置 UI 和持久化：

```ts
// 输入
columns: DataTableColumns<T>
columnSettings: boolean | string

// 功能
merge()     // 合并初始配置和存储配置
save()      // 保存当前列配置
clear()     // 清除存储的配置
```

## useTableDataFetcher

处理数据请求，自动处理分页逻辑：

```ts
// 分页模式
usePaginationList({ api, params, dataField, totalField, immediate })

// 非分页模式
useAsyncState(async (...args) => api(...args), [], { shallow: false, immediate })

// 输出
list: Ref<T[]>
getList: (...args) => void
isLoading: Ref<boolean>
paginationConfig: Ref
```

## 数据流

```
┌─────────────┐
│   useTable  │
└──────┬──────┘
       │
       ├── useSorter ───► sortParams ──┐
       │                                │
       ├── useFilter ──► filterParams ─┼──► params ──► useTableDataFetcher ──► list
       │                                │
       ├── useColumns ──► columns ──────┘
       │
       ├── Form ──► QueryForm
       │
       └── NDataTable ──► Table
```

## 相关文档

- [排序](sorting.md)
- [筛选](filtering.md)
- [列设置](column-settings.md)
