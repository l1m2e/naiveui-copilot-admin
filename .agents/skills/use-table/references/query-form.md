# 查询表单

## 静态配置

固定表单项配置：

```vue
<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

const queryFormSchema: FormItemProps[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'n-input',
    props: {
      placeholder: '搜索姓名或邮箱',
      clearable: true,
    },
  },
  {
    label: '状态',
    field: 'status',
    component: 'n-select',
    props: {
      clearable: true,
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    label: '日期范围',
    field: 'createTime',
    component: 'n-date-picker',
    props: { type: 'daterange' },
  },
]

const { QueryForm, Table, getList } = useTable({
  api: api.userGetList,
  queryFormSchema,
  columns,
  pagination: true,
})
</script>

<template>
  <div class="space-y-4">
    <QueryForm />
    <Table />
  </div>
</template>
```

## 动态配置

当表单的选项需要是响应式数据或者是从接口获取的时候 使用 `computed` 动态生成表单项 或者 使用 函数方式的 props

compute 动态生成表单项

```vue
<script setup lang="ts">
const { state: classifyOptions } = useAsyncState(async () => {
  const { data } = await api.foodGetDishClassifyList({})
  return data
}, [])

const { QueryForm, Table } = useTable({
  api: api.foodGetDishList,
  pagination: true,
  queryFormSchema: computed(() => [
    {
      label: '菜品名称',
      field: 'name',
      component: 'n-input',
      props: { placeholder: '请输入菜品名称' },
    },
    {
      label: '分类',
      field: 'classify_id',
      component: 'n-tree-select',
      props: {
        clearable: true,
        options: classifyOptions.value,
        labelField: 'name',
        valueField: 'id',
      },
    },
  ]),
  columns: [...],
})
</script>
```

函数props

```vue
<script setup lang="ts">
const { state: classifyOptions } = useAsyncState(async () => {
  const { data } = await api.foodGetDishClassifyList({})
  return data
}, [])

const { QueryForm, Table } = useTable({
  api: api.foodGetDishList,
  pagination: true,
  queryFormSchema: [
    {
      label: '菜品名称',
      field: 'name',
      component: 'n-input',
      props: { placeholder: '请输入菜品名称' },
    },
    {
      label: '分类',
      field: 'classify_id',
      component: 'n-tree-select',
      props: {
        clearable: true,
        options: () => classifyOptions.value,
        labelField: 'name',
        valueField: 'id',
      },
    },
  ],
  columns: [...],
})
</script>
```

## FormItem 组件类型

查询表单使用 `~/components/form-item` 中的表单项组件：

| 字段类型 | 组件 | 常用属性 |
|----------|------|----------|
| 文本 | n-input | placeholder, clearable |
| 数字 | n-input-number | min, max, precision |
| 下拉 | n-select | options, clearable, multiple |
| 日期 | n-date-picker | type: 'date' \| 'daterange' |
| 开关 | n-switch | - |
| 多选框 | n-checkbox | - |
| 级联选择 | n-cascader | options, multiple |
| 树选择 | n-tree-select | options, multiple, labelField, valueField |
| 自定义组件 | 组件名 | 根据组件定义传递 props |

## 自定义表单项

```ts
const queryFormSchema: FormItemProps[] = [
  {
    label: '部门',
    field: 'department_id',
    component: 'department-selector',  // 自定义组件
    props: { multiple: true },
  },
]
```

## 相关文档

- [配置选项](options.md)
- [基础用法](basic-usage.md)
