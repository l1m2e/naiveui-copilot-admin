# 核心 API

## 函数签名

```ts
function useTable<
  TApi extends ApiFunction = ApiFunction,
  TField extends string = 'data.list',
  TForm = ExtractApiParams<TApi>
>(options: UseTableOptions<TApi, TField>)
```

## 返回值

| 变量 | 类型 | 说明 |
|------|------|------|
| QueryForm | 组件 | 查询表单组件（未配置 queryFormSchema 时为 null） |
| Table | 组件 | 数据表格组件，支持透传所有 NDataTable 属性 |
| tableContext | Ref<DataTableInst> | Naive UI 表格实例 |
| formContext | Ref<{ form, formRef }> | 表单上下文，包含表单值和表单引用 |
| getList | Function | 手动刷新函数，可接收额外参数覆盖查询条件 |
| list | Ref<T[]> | 表格数据数组 |
| isLoading | Ref<boolean> | 加载状态 |
| paginationConfig | Ref | 分页配置对象 |
| sortState | Ref | 当前排序状态 |
| filterState | Ref | 当前筛选状态 |

## 解构示例

```ts
const {
  QueryForm,       // 查询表单组件
  Table,           // 数据表格组件
  tableContext,    // 表格实例引用
  formContext,     // 表单上下文引用
  getList,         // 刷新数据函数
  list,            // 表格数据数组
  isLoading,       // 加载状态
  paginationConfig,// 分页配置
  sortState,       // 排序状态
  filterState,     // 筛选状态
} = useTable<T>(options)
```

## tableContext 用法

获取 Naive UI DataTable 实例：

```ts
const { tableContext } = useTable({
  api: api.userGetList,
  columns,
})

// 滚动到指定位置
function scrollToTop() {
  tableContext.value?.scrollTo({ top: 0 })
}

// 获取选中行
function getSelectedRows() {
  return tableContext.value?.selectedRowKeys
}
```

## formContext 用法

获取查询表单的值和引用：

```ts
const { formContext } = useTable({
  api: api.userGetList,
  queryFormSchema,
  columns,
})

// 获取当前表单值
function getFormValues() {
  console.log(formContext.value?.form)
}

// 触发表单验证
async function validateForm() {
  const valid = await formContext.value?.formRef?.validate()
  return valid
}
```

## 相关文档

- [配置选项](options.md)
- [基础用法](basic-usage.md)
