# useTable 表格页面生成器

目标：根据用户提供的接口、图片或描述自动生成基于 **Naive UI** 的表格页面，包括查询表单和数据展示。

---

## 1. 核心概念

本项目的 `useTable` 基于 **Naive UI DataTable**，提供了一套声明式的表格解决方案：

- **UI 框架**：Naive UI（不是 Element Plus）
- **返回组件**：`QueryForm`（查询表单）和 `Table`（数据表格）
- **核心特性**：集成查询、分页、排序、筛选，支持列配置持久化
- **自动刷新**：查询、排序、筛选自动触发数据刷新，无需手动管理

---

## 2. 接口分析

当用户提供接口时，需要：

1. **查找接口文件**：理解接口的入参和出参类型
2. **分析入参**：用于生成 `queryFormSchema`（查询表单配置）
3. **分析出参**：用于生成 `columns`（表格列配置）
4. **确认分页格式**：默认返回格式为 `{ rows: [], total: number }`
   - 如果不同，需要通过 `dataField` 和 `totalField` 指定

---

## 3. 必读源码

在生成代码前，应当了解以下文件：

### 核心文件
- `src/composables/useTable/index.tsx` - useTable 主函数，理解其 API
- `src/components/form-item/index.ts` - 查询表单项类型定义
- `src/constants/FORM_ITEM_COMPONENT_MAP.ts` - 支持的表单组件列表

### 参考文档
- `docs/composables/use-table.md` - 官方文档
- `docs/composables/demos/use-table/` - 示例代码

---

## 4. useTable API

### 参数类型

```ts
interface UseTableOptions<T = any> {
  /** 请求方法 - 必传 */
  api: (...args: any[]) => any
  /** 查询表单配置 */
  queryFormSchema?: FormItemProps[]
  /** 表格列配置 */
  columns?: DataTableColumns<T>
  /** 是否启用分页，默认 false */
  pagination?: boolean
  /** 列配置持久化，传入 key 字符串可持久化到 localStorage */
  columnSettings?: boolean | ColumnSettingsKey
  /** 数据字段名，默认 'rows' */
  dataField?: string
  /** 总数字段名，默认 'total' */
  totalField?: string
}
```

### 返回值

```ts
{
  QueryForm,        // 查询表单组件
  Table,           // 表格组件
  tableContext,    // 表格实例引用
  formContext,     // 表单上下文
  getList,         // 手动刷新数据方法
  list,            // 表格数据数组
  isLoading,       // 加载状态
  paginationConfig,// 分页配置
  sortState,       // 排序状态
  filterState      // 筛选状态
}
```

---

## 5. 查询表单配置规则

### FormItemProps 结构

```ts
{
  label: string                 // 表单项标签
  field: string                 // 表单字段名（对应接口入参）
  component: string | VNode     // 组件类型
  props?: Record<string, any>   // 组件属性
  value?: any                   // 默认值
  rule?: any                    // Yup 验证规则
}
```

### 组件选择规则（Naive UI）

| 字段类型 | 推荐组件 | 示例 |
|---------|---------|------|
| 文本输入 | `n-input` | 搜索关键字、编号 |
| 数字输入 | `n-input-number` | 价格、数量 |
| 下拉选择 | `n-select` | 状态、类型 |
| 日期选择 | `n-date-picker` | 单个日期 |
| 日期范围 | `n-date-picker` (type="daterange") | 起止时间 |
| 级联选择 | `n-cascader` | 地区、分类 |
| 开关 | `n-switch` | 是否启用 |
| 多选 | `n-checkbox` | 多选框 |

**支持的所有组件**：见 `src/constants/FORM_ITEM_COMPONENT_MAP.ts`

### 示例

```ts
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
      clearable: true,
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'n-date-picker',
    props: { type: 'daterange' }
  }
]
```

---

## 6. 表格列配置规则

### 列配置结构（基于 Naive UI DataTable）

```ts
{
  title: string          // 列标题
  key: string            // 数据字段名（对应接口出参）
  width?: number         // 列宽度
  sorter?: boolean       // 是否启用排序
  filter?: boolean       // 是否启用筛选
  filterOptions?: Array  // 筛选选项
  render?: (row) => VNode // 自定义渲染
  fixed?: 'left' | 'right' // 固定列
}
```

### 生成原则

1. **基础列**：只需 `title` 和 `key`，组件自动渲染数据
2. **枚举类型**：使用 `render` 函数映射枚举值
3. **时间字段**：使用 `render` 格式化时间戳
4. **特殊渲染**：需要按钮、标签等复杂元素时使用 `render`
5. **尽量简单**：能用 `key` 自动渲染就不要写 `render`

### 示例

```ts
const columns = [
  // 基础列 - 自动渲染
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },

  // 枚举类型 - 映射显示
  {
    title: '状态',
    key: 'status',
    render: (row) => row.status === 1 ? '启用' : '禁用'
  },

  // 时间格式化（如果有格式化工具）
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatDate(row.createTime)
  },

  // 带排序和筛选
  {
    title: '部门',
    key: 'department',
    sorter: true,
    filter: true,
    filterOptions: [
      { label: '技术部', value: '技术部' },
      { label: '销售部', value: '销售部' }
    ]
  },

  // 操作列 - 复杂渲染
  {
    title: '操作',
    key: 'actions',
    render: (row) => (
      <n-space>
        <n-button size="small" onClick={() => handleEdit(row)}>编辑</n-button>
        <n-button size="small" type="error" onClick={() => handleDelete(row)}>删除</n-button>
      </n-space>
    )
  }
]
```

---

## 7. 完整示例

### 基础表格（仅数据展示）

```vue
<script setup lang="ts">
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' }
]

const { Table } = useTable({
  api: fetchUsers,
  columns
})
</script>

<template>
  <Table />
</template>
```

### 分页表格

```vue
<script setup lang="ts">
const { Table } = useTable({
  api: fetchUsers,
  columns,
  pagination: true  // 启用分页
})
</script>

<template>
  <Table />
</template>
```

### 带查询表单的完整表格

```vue
<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

interface User {
  id: number
  name: string
  email: string
  status: number
}

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
      clearable: true,
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
]

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
  {
    title: '状态',
    key: 'status',
    render: (row: User) => row.status === 1 ? '启用' : '禁用'
  }
]

const { QueryForm, Table, getList } = useTable<User>({
  api: fetchUsers,
  queryFormSchema,
  columns,
  pagination: true
})

// 手动刷新
function refresh() {
  getList()
}
</script>

<template>
  <div class="space-y-4">
    <QueryForm />
    <Table />
  </div>
</template>
```

### 自定义数据字段

```vue
<script setup lang="ts">
// 如果后端返回 { data: [...], count: 100 }
const { Table } = useTable({
  api: fetchUsers,
  columns,
  pagination: true,
  dataField: 'data',      // 自定义数据字段
  totalField: 'count'     // 自定义总数字段
})
</script>
```

### 列配置持久化

```vue
<script setup lang="ts">
const { Table } = useTable({
  api: fetchUsers,
  columns,
  columnSettings: 'user-table-settings'  // 使用 key 持久化列配置
})
</script>
```

---

## 8. 代码生成工作流

### Step 1: 分析接口

```
用户提供：src/api/user.ts 中的 fetchUserList
↓
读取文件，分析：
- 入参: { keyword?: string, status?: number, page: number, pageSize: number }
- 出参: { rows: User[], total: number }
- User: { id: number, name: string, email: string, status: number }
```

### Step 2: 生成查询表单

```ts
// 根据入参生成
const queryFormSchema: FormItemProps[] = [
  { label: '关键字', field: 'keyword', component: 'n-input' },
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
```

### Step 3: 生成表格列

```ts
// 根据出参生成
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
  {
    title: '状态',
    key: 'status',
    render: (row: User) => row.status === 1 ? '启用' : '禁用'
  }
]
```

### Step 4: 组装完整代码

```vue
<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'
import type { User } from '~/api/user'
import { fetchUserList } from '~/api/user'

const queryFormSchema: FormItemProps[] = [...]
const columns = [...]

const { QueryForm, Table } = useTable<User>({
  api: fetchUserList,
  queryFormSchema,
  columns,
  pagination: true
})
</script>

<template>
  <div class="space-y-4">
    <QueryForm />
    <Table />
  </div>
</template>
```

---

## 9. 注意事项

1. **UI 框架**：使用 Naive UI，不是 Element Plus
2. **组件命名**：使用 `n-` 前缀，如 `n-input`、`n-select`
3. **返回组件**：使用 `QueryForm` 和 `Table` 组件，不是 `key` + 独立组件
4. **自动刷新**：查询表单的搜索和重置会自动调用 `getList()`
5. **类型安全**：建议传入泛型 `useTable<DataType>()`
6. **API 格式**：分页模式下默认返回 `{ rows: [], total: number }`
7. **列渲染**：优先使用 `key` 自动渲染，特殊情况才用 `render`

---

## 10. 相关链接

- [Naive UI DataTable 文档](https://www.naiveui.com/zh-CN/os-theme/components/data-table)
- [useForm 文档](../../docs/composables/use-form.md)
- [项目示例](../../docs/composables/demos/use-table/)
