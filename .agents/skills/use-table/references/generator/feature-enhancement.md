# 功能完善

## 操作列完善

根据需求添加编辑、删除、详情按钮。

## 基础操作列

```ts
{
  title: '操作',
  key: 'actions',
  width: 120,
  fixed: 'right',
  render: (row) => (
    <n-space>
      <n-button quaternary type="primary" size="small" onClick={() => handleDetail(row)}>
        详情
      </n-button>
      <n-button quaternary type="primary" size="small" onClick={() => handleEdit(row)}>
        编辑
      </n-button>
    </n-space>
  ),
}
```

## 带删除的操作列

```ts
{
  title: '操作',
  key: 'actions',
  width: 200,
  fixed: 'right',
  render: (row) => (
    <n-space>
      <n-button quaternary type="primary" size="small" onClick={() => handleDetail(row)}>
        详情
      </n-button>
      <n-button quaternary type="primary" size="small" onClick={() => handleEdit(row)}>
        编辑
      </n-button>
      <n-button quaternary type="error" size="small" onClick={() => handleDelete(row)}>
        删除
      </n-button>
    </n-space>
  ),
}
```

## 带确认的删除

```ts
{
  title: '操作',
  key: 'actions',
  width: 200,
  fixed: 'right',
  render: (row) => (
    <n-space>
      <n-button quaternary type="primary" size="small" onClick={() => handleEdit(row)}>
        编辑
      </n-button>
      <n-popconfirm onPositiveClick={() => handleDelete(row)}>
        {{ trigger: () => <n-button quaternary type="error" size="small">删除</n-button> }}
        确定删除「{row.name}」吗？
      </n-popconfirm>
    </n-space>
  ),
}
```

## 状态开关联动

### 状态切换函数

```ts
async function changeStatus(row: XxxItem) {
  await api.xxxChangeStatus({ data: { id: row.id, is_active: !row.is_active } })
  row.is_active = !row.is_active
}
```

### 列配置

```ts
{
  title: '状态',
  key: 'is_active',
  width: 100,
  render: (row) => (
    <n-switch
      key={row.id}
      value={row.is_active}
      onClick={() => changeStatus(row)}
    />
  ),
}
```

## 详情跳转

### 路由跳转

```ts
function jumpDetail(row: XxxItem) {
  router.push({
    name: '/xxx/xxx/[id]',
    params: { id: row.id },
  })
}
```

### 列配置

```ts
{
  title: '操作',
  key: 'actions',
  width: 100,
  render: (row) => (
    <n-button quaternary type="primary" size="small" onClick={() => jumpDetail(row)}>
      详情
    </n-button>
  ),
}
```

## 批量操作

### 带选择列的表格

```ts
const columns = [
  { type: 'selection', width: 50 },
  { title: '名称', key: 'name' },
  // ...
]

const { tableContext } = useTable({ ... })

// 获取选中行
function getSelectedRows() {
  return tableContext.value?.selectedRowKeys
}
```

## 相关文档

- [代码生成](code-generation.md)
