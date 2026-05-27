# 常用模式

## 操作列

管理表格的标准操作列写法：

```ts
const columns = [
  { title: '名称', key: 'name' },
  { title: '状态', key: 'is_active', width: 100 },
  {
    title: '操作',
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: (row) => (
      <n-space>
        <n-button quaternary type="primary" size="small" onClick={() => detail(row)}>
          详情
        </n-button>
        <n-button quaternary type="primary" size="small" onClick={() => edit(row)}>
          编辑
        </n-button>
      </n-space>
    ),
  },
]
```

### 快捷操作列（带确认）

```ts
{
  title: '操作',
  key: 'actions',
  render: (row) => (
    <n-space>
      <n-button size="small" quaternary onClick={() => view(row)}>查看</n-button>
      <n-button size="small" quaternary type="primary" onClick={() => edit(row)}>编辑</n-button>
      <n-popconfirm onPositiveClick={() => remove(row)}>
        确定删除？
        {{ trigger: () => <n-button size="small" quaternary type="error">删除</n-button> }}
      </n-popconfirm>
    </n-space>
  ),
}
```

## 状态开关联动 API

```ts
{
  title: '状态',
  key: 'is_active',
  render: (row) =>  <n-switch value={row.is_active} onClick={() => updateStatus(row)}/>
}

async function updateStatus(row: UserItem) {
  await api.userUpdateStatus({ data: { id: row.id, is_active: !row.is_active } })
  row.is_active = !row.is_active
}
```

## 数组展示

### 逗号分隔

```ts
{
  title: '标签',
  key: 'tags',
  render: (row) => <div>{row.tags?.join(', ')}</div>,
}
```

### 嵌套数组（带省略）

```ts
{
  title: '科室',
  key: 'department_list',
  render: row => <n-ellipsis class="w-200px">{row.department_list.map(d => d.name).join(', ')}</n-ellipsis>,
}
```

### 复杂数组展示

```ts
{
  title: '价格',
  key: 'price_info',
  render: row => (
    <div class={row.specs_list.length === 0 ? 'p-5' : ''}>
      {row.specs_list?.map(spec => (
        <div key={spec.specs_name} class="p-2 text-center border-b">
          {`${spec.price} 元/${spec.specs_name}`}
        </div>
      ))}
    </div>
  ),
}
```

## 条件样式

```ts
{
  title: '状态',
  key: 'status',
  render: (row) => (
    <n-tag type={row.status === 'active' ? 'success' : 'error'}>
      {row.status}
    </n-tag>
  ),
}
```


## 下载链接

```ts
{
  title: '失败文件',
  key: 'fail_file',
  render: row => {
    if (row.fail_file?.file_url) {
      return <n-button text type="success" size="small" onClick={() => download(row)}>下载</n-button>
    }
  },
}
```
## 复合条件渲染

```ts
{
  title: '纸张大小',
  key: 'page_size',
  render: row => row.paper_weight && row.paper_height
    ? `${row.paper_weight}*${row.paper_height}`
    : '-',
}
```

## 相关文档

- [自定义渲染](rendering.md)
- [高级用法](advanced.md)
