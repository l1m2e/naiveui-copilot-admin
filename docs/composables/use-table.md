# useTable

`useTable` 是一个基于 Naive UI DataTable 的声明式表格 Composable，集成了查询表单、分页、排序、筛选等功能，提供开箱即用的表格解决方案。

## 特性

- 🎯 **声明式配置** - 通过配置快速创建表格
- 🔍 **集成查询表单** - 基于 useForm 的查询面板
- 📄 **智能分页** - 自动处理分页逻辑
- 🔄 **排序&筛选** - 内置排序和筛选支持
- 💾 **列配置持久化** - 支持列显示/隐藏、拖拽排序
- ⚡️ **自动刷新** - 查询、排序、筛选自动触发数据刷新
- 🎨 **灵活扩展** - 支持所有 NDataTable 属性
- 🔥 **TypeScript** - 完整的类型支持

## 基础用法

最简单的表格示例。

<preview path="./demos/use-table/basic.vue"></preview>

## 分页表格

启用分页功能。

<preview path="./demos/use-table/pagination.vue"></preview>

## 查询表单

集成查询表单。

<preview path="./demos/use-table/query-form.vue"></preview>

## 排序和筛选

使用排序和筛选功能。

<preview path="./demos/use-table/sort-filter.vue"></preview>

## API

### useTable

```ts
const {
  QueryForm,
  Table,
  getList,
  list,
  isLoading
} = useTable<T>(options)
```

**参数：**

```ts
interface UseTableOptions<T = any> {
  /** 请求方法 */
  api: (...args: any[]) => any
  /** 查询表单配置 */
  queryFormSchema?: FormItemProps[]
  /** 表格列配置 */
  columns?: DataTableColumns<T>
  /** 是否启用分页，默认 false */
  pagination?: boolean
  /** 是否启用列配置（拖拽排序、显示/隐藏），默认 false */
  columnSettings?: boolean | ColumnSettingsKey
  /** 数据字段名，默认 'rows' */
  dataField?: string
  /** 总数字段名，默认 'total' */
  totalField?: string
}
```

**返回值：**

- `QueryForm` - 查询表单组件
- `Table` - 表格组件
- `tableContext` - 表格实例引用
- `formContext` - 表单上下文
- `getList()` - 刷新数据方法
- `list` - 表格数据数组
- `isLoading` - 加载状态
- `paginationConfig` - 分页配置
- `sortState` - 排序状态
- `filterState` - 筛选状态

## 高级用法

### 自定义列配置

```vue
<script setup lang="ts">
const columns = [
  { type: 'selection' },
  { title: 'ID', key: 'id', width: 80 },
  {
    title: '姓名',
    key: 'name',
    sorter: true,
    filter: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' }
    ]
  },
  { title: '年龄', key: 'age', sorter: 'default' },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h(NButton, { onClick: () => handleEdit(row) }, '编辑')
    }
  }
]

const { Table, getList } = useTable({
  api: fetchUsers,
  columns,
  pagination: true
})
</script>
```

### 查询表单配置

```vue
<script setup lang="ts">
import * as yup from 'yup'

const queryFormSchema: FormItemProps[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'n-input',
    props: { placeholder: '搜索姓名或邮箱' }
  },
  {
    label: '状态',
    field: 'status',
    component: 'n-select',
    props: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
]

const { QueryForm, Table } = useTable({
  api: fetchUsers,
  queryFormSchema,
  columns,
  pagination: true
})
</script>

<template>
  <div>
    <QueryForm />
    <Table class="mt-4" />
  </div>
</template>
```

### 列配置持久化

```ts
const { Table } = useTable({
  api: fetchUsers,
  columns,
  // 使用 key 实现持久化
  columnSettings: 'user-table-settings'
})
```

用户的列显示/隐藏和排序设置将自动保存到 localStorage。

### 自定义数据字段

```ts
// 后端返回格式: { data: [...], count: 100 }
const { Table } = useTable({
  api: fetchUsers,
  columns,
  pagination: true,
  dataField: 'data',    // 自定义数据字段
  totalField: 'count'   // 自定义总数字段
})
```

## 注意事项

1. **API 格式** - 分页模式下，API 应返回 `{ [dataField]: [], [totalField]: number }` 格式
2. **列配置** - 使用 `sorter` 和 `filter` 属性开启排序和筛选
3. **自动刷新** - 查询表单的搜索和重置会自动调用 `getList()`
4. **类型安全** - 建议为 `useTable` 传入泛型类型以获得完整的类型提示

## 相关链接

- [Naive UI DataTable 文档](https://www.naiveui.com/zh-CN/os-theme/components/data-table)
- [useForm 文档](/composables/use-form)
