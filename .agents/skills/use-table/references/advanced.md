# 高级用法

## 多表格使用

同一个页面可以使用多个 useTable 实例，通过重命名变量区分：

```vue
<script setup lang="ts">
// 系统模板表格
const { Table: SystemTable, getList: systemGetList } = useTable({
  api: api.systemGetPrintTemplateList,
  pagination: true,
  immediate: false,
  columns: [...],
})

// 自定义模板表格
const { Table: CustomTable, getList: customGetList } = useTable({
  api: api.systemGetPrintTemplateList,
  pagination: true,
  immediate: false,
  columns: [...],
})

function getList(data: RequestParams) {
  templateType.value === '1' ? systemGetList(data) : customGetList(data)
}
</script>

<template>
  <n-tabs v-model:value="templateType">
    <n-tab-pane name="1" tab="系统内置模版">
      <SystemTable :row-key="row => row.id" />
    </n-tab-pane>
    <n-tab-pane name="2" tab="自定义模版">
      <CustomTable :row-key="row => row.id" />
    </n-tab-pane>
  </n-tabs>
</template>
```

## TypeScript 泛型

传入 API 类型以获得自动数据类型推断：

```ts
import type { UserGetListListItems } from '~/api/generated'

const { Table, list } = useTable<typeof api.userGetList>({
  api: api.userGetList,
  columns,
})

// list 类型为 UserGetListListItems[]
```

## 表格属性透传

Table 组件支持透传所有 Naive UI DataTable 的属性：

```vue
<template>
  <!-- 行 key（必须） -->
  <Table :row-key="row => row.id" />

  <!-- 最大高度 -->
  <Table :max-height="300" />

  <!-- 斑马纹 -->
  <Table :striped="false" />

  <!-- 边框 -->
  <Table :bordered="true" />

  <!-- 单行分隔线 -->
  <Table :single-line="false" />

  <!-- 虚拟滚动（大数据量） -->
  <Table :virtual-scroll="true" :max-height="400" />

  <!-- 展开行 -->
  <Table :expand-row-keys="expandedKeys" />

  <!-- 行类名 -->
  <Table :row-class-name="rowClassName" />
</template>
```

## 手动刷新

```ts
const { Table, getList, list } = useTable({
  api: api.userGetList,
  columns,
  pagination: true,
})

// 新增/编辑后刷新
async function addUser(data: UserForm) {
  await api.userCreate({ data })
  getList()  // 刷新列表
}

// 带参数刷新（覆盖查询条件）
function refreshWithFilter(status: number) {
  getList({ status })  // 向 API 传递额外参数
}
```

## 相关文档

- [核心 API](core-api.md)
- [常用模式](patterns.md)
