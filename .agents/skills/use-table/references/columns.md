# 列配置

## 基础列配置

```ts
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '邮箱', key: 'email' },
]
```

## 列属性

| 属性 | 类型 | 说明 |
|------|------|------|
| type | string | 列类型，如 'selection' |
| title | string | 列标题 |
| key | string | 数据字段名 |
| width | number | 列宽度 |
| align | 'left' \| 'center' \| 'right' | 对齐方式 |
| fixed | 'left' \| 'right' | 固定列 |
| visible | boolean | 是否显示 |

## 对齐方式

```ts
const columns = [
  { title: '排序号', key: 'sort', align: 'center' },
  { title: '名称', key: 'name', align: 'left' },
  { title: '数量', key: 'count', align: 'right' },
]
```

## 行选择列

添加 `type: 'selection'` 实现多选功能：

```ts
const columns = [
  { type: 'selection', width: 50 },  // 多选列
  { title: 'ID', key: 'id', width: 80 },
  { title: '名称', key: 'name' },
  // ...
]
```

使用选中行：

```ts
const { tableContext } = useTable({
  api: api.userGetList,
  columns,
})

function getSelectedRows() {
  return tableContext.value?.selectedRowKeys
}
```

## 固定列

```ts
const columns = [
  { title: 'ID', key: 'id', width: 80, fixed: 'left' },
  { title: '姓名', key: 'name' },
  { title: '操作', key: 'actions', width: 160, fixed: 'right' },
]
```

## 相关文档

- [自定义渲染](rendering.md)
- [排序](sorting.md)
- [筛选](filtering.md)
