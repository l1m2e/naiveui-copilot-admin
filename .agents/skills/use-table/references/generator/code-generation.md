# 代码生成

## 完整组件代码模板

根据配置生成完整的 Vue 组件代码。

## 代码生成示例

### 示例 1：用户管理页面

**输入**：
- 页面标题：用户管理
- 列表接口：api.userGetStaffList
- CRUD 接口：create/update/delete/active staff

**生成代码**：

```vue
<script lang="tsx" setup>
import type { UserGetStaffListListItems } from '~/api/generated'
import Modal from './components/user-modal.vue'

const modalRef = useTemplateRef('modalRef')
const message = useMessage()

const { mutateAsync: createStaff } = api.useUserCreateStaffMutation()
const { mutateAsync: updateStaff } = api.useUserUpdateStaffMutation()
const { mutateAsync: activeStaff } = api.useUserActiveStaffMutation()

const { QueryForm, Table, getList } = useTable({
  api: api.userGetStaffList,
  pagination: true,
  queryFormSchema: [
    {
      label: '姓名',
      field: 'name',
      component: 'n-input',
      props: { placeholder: '请输入姓名', clearable: true },
    },
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
  ],
  columns: [
    { title: 'ID', key: 'id', width: 80 },
    { title: '姓名', key: 'name' },
    { title: '工号', key: 'work_no' },
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
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: row => (
        <n-space>
          <n-button quaternary type="primary" onClick={() => edit(row)}>
            编辑
          </n-button>
        </n-space>
      ),
    },
  ],
})

async function changeStatus(row: UserGetStaffListListItems) {
  await activeStaff({ data: { staff_id: row.id, is_active: !row.is_active } })
  row.is_active = !row.is_active
  message.success('状态更新成功')
}

async function edit(row: UserGetStaffListListItems) {
  const data = await modalRef.value!.open(row)
  await updateStaff({ data: { ...data, staff_id: row.id } })
  getList()
  message.success('更新成功')
}

async function add() {
  const data = await modalRef.value!.open()
  await createStaff({ data })
  getList()
  message.success('创建成功')
}
</script>

<template>
  <n-card>
    <QueryForm as="div" class="mt-2" />
    <n-space class="my-4">
      <n-button type="primary" @click="add">新建用户</n-button>
    </n-space>
    <Table :row-key="row => row.id" />
    <Modal ref="modalRef" />
  </n-card>
</template>
```

### 示例 2：菜品分类管理

```vue
<script lang="tsx" setup>
import type { FoodGetDishClassifyListClassifyInfo } from '~/api/generated'
import Modal from './components/dish-classify-modal.vue'

const modalRef = useTemplateRef('modalRef')
const dialog = useDialog()

const { mutateAsync: createDishClassify } = api.useFoodAddDishClassifyMutation()
const { mutateAsync: updateDishClassify } = api.useFoodUpdateDishClassifyMutation()
const { mutateAsync: changeClassifyStatus } = api.useFoodChangeDishClassifyStatusMutation()

const { QueryForm, Table, getList, list } = useTable({
  api: api.foodGetDishClassifyList,
  queryFormSchema: [
    {
      label: '分类名称',
      field: 'name',
      component: 'n-input',
      props: { placeholder: '请输入分类名称', clearable: true },
    },
  ],
  columns: [
    { title: '分类名称', key: 'name' },
    {
      title: '启用',
      key: 'is_active',
      render: row => (
        <n-switch
          key={row.id}
          value={row.is_active}
          onClick={() => changeStatus(row)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: row => (
        <n-space>
          <n-button quaternary type="primary" size="small" onClick={() => editItem(row)}>
            编辑
          </n-button>
          <n-button quaternary type="error" size="small" onClick={() => removeItem(row)}>
            删除
          </n-button>
        </n-space>
      ),
    },
  ],
})

async function changeStatus(row: FoodGetDishClassifyListClassifyInfo) {
  await changeClassifyStatus({ data: { ...row, is_active: !row.is_active } })
  row.is_active = !row.is_active
}

async function addItem() {
  const data = await modalRef.value!.open()
  await createDishClassify({ data })
  getList()
}

async function editItem(row: FoodGetDishClassifyListClassifyInfo) {
  const data = await modalRef.value!.open(row)
  await updateDishClassify({ data: { ...data, id: row.id } })
  getList()
}

async function removeItem(row: FoodGetDishClassifyListClassifyInfo) {
  dialog.warning({
    title: '删除分类',
    content: `确定删除分类「${row.name}」吗？`,
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      await api.useFoodDeleteDishClassifyMutation()({ data: { id: row.id } })
      getList()
    },
  })
}
</script>

<template>
  <n-card>
    <QueryForm as="div" class="mt-2" />
    <div class="my-4 flex gap-2">
      <n-button type="primary" @click="addItem">新增分类</n-button>
    </div>
    <Table :row-key="row => row.id" />
    <Modal ref="modalRef" :tree-list="list" />
  </n-card>
</template>
```

## 相关文档

- [配置生成](config-generation.md)
- [功能完善](feature-enhancement.md)
