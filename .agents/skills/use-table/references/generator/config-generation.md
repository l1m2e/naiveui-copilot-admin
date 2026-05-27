# 配置生成

## queryFormSchema 生成

根据 API 参数生成查询表单配置。

### 分析 API 参数

从列表接口的参数类型中提取可搜索字段：

```ts
// 假设 API 参数类型
interface GetStaffListParams {
  name?: string           // 姓名
  login_account?: string  // 登录账号
  is_active?: boolean     // 是否启用
  department_id_list?: number[] // 科室ID列表
}
```

### 生成表单项配置

```ts
const queryFormSchema: FormItemProps[] = [
  // 文本搜索
  {
    label: '姓名',
    field: 'name',
    component: 'n-input',
    props: {
      placeholder: '请输入姓名',
      clearable: true,
    },
  },
  // 状态下拉框
  {
    label: '是否启用',
    field: 'is_active',
    component: 'n-select',
    props: {
      clearable: true,
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
]
```

### 组件映射规则

| 参数类型 | 推荐组件 | 示例 |
|----------|----------|------|
| string (模糊搜索) | n-input | name, title |
| string (精确匹配) | n-select | status, type |
| boolean | n-select / n-switch | is_active, enabled |
| number | n-input-number | age, quantity |
| date (单选) | n-date-picker | created_at |
| date (范围) | n-date-picker (daterange) | dateRange |
| 树形结构 | n-tree-select | department_id |

## columns 生成

根据 API 返回数据类型生成表格列配置。

### 分析返回数据类型

```ts
// 假设 API 返回数据项类型
interface StaffItem {
  id: number
  name: string
  work_no: string
  phone: string
  is_active: boolean
  create_time: string
}
```

### 生成列配置

```ts
const columns: DataTableColumns<StaffItem> = [
  // 基础列
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '工号', key: 'work_no' },

  // 布尔值转状态
  {
    title: '是否启用',
    key: 'is_active',
    width: 100,
    render: row => (
      <n-switch
        key={row.id}
        value={row.is_active}
        onClick={() => changeStatus(row)}
      />
    ),
  },

  // 日期格式化
  { title: '创建时间', key: 'create_time', width: 180 },

  // 操作列
  {
    title: '操作',
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: row => (
      <n-space>
        <n-button quaternary type="primary" onClick={() => edit(row)}>编辑</n-button>
      </n-space>
    ),
  },
]
```

### 渲染类型映射

| 数据类型 | 渲染方式 | 示例 |
|----------|----------|------|
| 字符串 | 直接展示 | name, title |
| 数字 | 直接展示 | id, count, price |
| 布尔值 | 开关/标签 | is_active, enabled |
| 日期 | 格式化展示 | create_time |
| 数组 | join 或循环 | tags, category_list |

## 相关文档

- [接口查找](api-discovery.md)
- [代码生成](code-generation.md)
