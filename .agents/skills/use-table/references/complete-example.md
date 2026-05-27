# 完整示例
说明：当增删改查中的表单逻辑较复杂、需要独立组件或更灵活的控制（例如多步表单、复杂验证或异步初始化）时，优先使用 `usePromiseModal` 创建独立 Modal 组件并在页面中引入；否则使用 `useFormModal` 可更便捷地快速构建表单式 Modal。

## usePromiseModal示例

```vue
<script lang="tsx" setup>
import type { UserGetListListItems } from '~/api/generated'
import Modal from './components/user-modal.vue'

const modalRef = useTemplateRef('modalRef')
const message = useMessage()

const { QueryForm, Table, getList, list } = useTable({
  api: api.userGetList,
  pagination: true,
  queryFormSchema: [
    {
      label: '用户名',
      field: 'name',
      component: 'n-input',
      props: { placeholder: '请输入用户名', clearable: true },
    },
    {
      label: '状态',
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
  ],
  columns: [
    { title: 'ID', key: 'id', width: 80 },
    { title: '用户名', key: 'name' },
    { title: '邮箱', key: 'email' },
    {
      title: '状态',
      key: 'is_active',
      width: 100,
      render: (row) => (
        <n-switch
          key={row.id}
          value={row.is_active}
          onClick={() => toggleStatus(row)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (row) => (
        <n-space>
          <n-button quaternary type="primary" onClick={() => edit(row)}>
            编辑
          </n-button>
        </n-space>
      ),
    },
  ],
})

async function toggleStatus(row: UserGetListListItems) {
  await api.userUpdateStatus({ data: { id: row.id, is_active: !row.is_active } })
  row.is_active = !row.is_active
  message.success('状态更新成功')
}

async function edit(row: UserGetListListItems) {
  const data = await modalRef.value!.open(row)
  await api.userUpdate({ data: { ...data, id: row.id } })
  getList()
  message.success('更新成功')
}

async function add() {
  const data = await modalRef.value!.open()
  await api.userCreate({ data })
  getList()
  message.success('创建成功')
}
</script>

<template>
  <div>
    <QueryForm class="mb-4" />
    <n-card>
      <n-space class="my-4">
        <n-button type="primary" @click="add">新增用户</n-button>
      </n-space>
      <Table :row-key="row => row.id" />
      <Modal ref="modalRef" />
    </n-card>
  </div>
</template>
```


## useFormModal 示例

```vue
<script lang="tsx" setup>
import type { StockCreateWarehouse200, StockGetWarehouseListListItems } from '~/api/generated'

definePage({
  meta: {
    title: '仓库管理',
    order: 1
  },
})

const { mutateAsync: createWarehouse } = api.useStockCreateWarehouseMutation()
const { mutateAsync: changeWarehouseStatus } = api.useStockToggleWarehouseStatusMutation()

const { Modal, open, form } = useFormModal<StockCreateWarehouse200['data']>({
  schema: [
    {
      label: '院方标识',
      field: 'hospital_key',
      component: 'n-input',
      props: { placeholder: '请输入院方标识', },
    },
    {
      label: '仓库名称',
      field: 'name',
      component: 'n-input',
      props: {
        placeholder: '请输入仓库名称',
      },
      rule: yup.string().required('名称不能为空'),
    },

    {
      label: '描述',
      field: 'description',
      component: 'n-input',
    },
    {
      label: '是否启用',
      field: 'is_active',
      component: 'n-switch',
      value: true,
    },
  ],
  formProps: { labelPlacement: 'left', labelWidth: 'auto' },

})

const { QueryForm, Table, getList } = useTable({
  api: api.stockGetWarehouseList,
  pagination: true,
  queryFormSchema: [
    {
      label: '仓库名称',
      field: 'name',
      component: 'n-input',
      props: {
        placeholder: '请输入仓库名称',
        clearable: true,
      },
    }
  ],
  columns: [
    { title: '仓库名称', key: 'name' },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: row => (
        <n-space>
          <n-button quaternary type="primary" size="small" onClick={() => editItem(row)}>编辑</n-button>
        </n-space>
      ),
    },
  ],
})
async function changeStatus(row: StockGetWarehouseListListItems) {
  await changeWarehouseStatus({ data: { id: row.id, is_active: !row.is_active } })
  row.is_active = !row.is_active
}

async function editItem(row: StockGetWarehouseListListItems) {
  const res = await open(row)
  await createWarehouse({ data: { ...res } })
  getList()
}

async function add() {
  const res = await open()
  await createWarehouse({ data: { ...res } })
  getList()
}
</script>

<template>
  <div>
    <QueryForm class="mb-4" />
    <n-card>
      <n-space class="my-4">
        <n-button type="primary" @click="add">新增仓库</n-button>
      </n-space>
      <Table :row-key="row => row.id" />
      <Modal ref="modalRef" />
    </n-card>
  </div>
</template>
```

## 相关文档（便捷索引）
- [基础用法](basic-usage.md)
- [查询表单](query-form.md)
- [分页](pagination.md)
- [常用模式](patterns.md)
