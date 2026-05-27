# 自定义渲染

## render 函数

使用 `render` 函数自定义单元格内容：

```ts
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  {
    title: '状态',
    key: 'status',
    render: (row) => (
      <n-tag type={row.status === 1 ? 'success' : 'error'}>
        {row.status === 1 ? '启用' : '禁用'}
      </n-tag>
    ),
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    render: (row) => (
      <n-space>
        <n-button size="small" onClick={() => edit(row)}>编辑</n-button>
        <n-button size="small" type="error" onClick={() => remove(row)}>删除</n-button>
      </n-space>
    ),
  },
]
```

## 独立的渲染函数

复杂的渲染逻辑可以提取为独立函数：

```vue
<script setup lang="ts">
function renderStatus(row: UserItem) {
  const statusMap = new Map<number, string>([[1, 'success'], [2, 'error']])
  return (
    <n-tag type={statusMap.get(row.status)} round size="small">
      {row.status_str ?? (row.status === 1 ? '成功' : '失败')}
    </n-tag>
  )
}

function renderPrice(row: FoodItem, field: string) {
  return (
    <div class={row.specs_list.length === 0 ? 'p-5' : ''}>
      {row.specs_list?.map(spec => (
        <div key={spec.specs_name} class="p-2 text-center border-b">
          {`${spec[field]} 元/${spec.specs_name}`}
        </div>
      ))}
    </div>
  )
}

const columns = [
  { title: '状态', key: 'status', render: renderStatus },
  { title: '零售价', key: 'default_price', render: row => renderPrice(row, 'default_price') },
]
</script>
```

## 相关文档

- [列配置](columns.md)
- [常用模式](patterns.md)
