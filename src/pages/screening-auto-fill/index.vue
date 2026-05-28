<script lang="tsx" setup>
import type { GetScreeningAutoFillForms200 } from '~/api/generated'
import { deleteScreeningAutoFillFormsId, getScreeningAutoFillForms } from '~/api/generated'

definePage({
  meta: {
    title: '筛评填写管理',
    icon: 'i-lucide-clipboard-check',
    order: 2,
  },
})

const message = useMessage()
const dialog = useDialog()
const router = useRouter()

type FormRow = GetScreeningAutoFillForms200['rows'][number]

const { QueryForm, Table, getList } = useTable({
  api: getScreeningAutoFillForms,
  queryFormSchema: [
    {
      label: '表单名称',
      field: 'formName',
      component: 'n-input',
    },
    {
      label: '表单 Key',
      field: 'formKey',
      component: 'n-input',
    },
  ],
  columns: [
    { title: '表单名称', key: 'name', width: 200 },
    { title: '表单 Key', key: 'formKey', width: 200 },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (row: FormRow) => (
        <div style="display: flex; gap: 8px; justify-content: center;">
          <n-button size="small" quaternary onClick={() => handleDetail(row)}>
            详情
          </n-button>
          <n-button size="small" quaternary type="error" onClick={() => handleDelete(row)}>
            删除
          </n-button>
        </div>
      ),
    },
  ],
  dataField: 'rows',
  pagination: true,
})

function handleDetail(row: FormRow) {
  router.push(`/screening-auto-fill/${row.id}`)
}

function handleAdd() {
  router.push('/screening-auto-fill/new')
}

function handleDelete(row: FormRow) {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除表单「${row.name}」吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteScreeningAutoFillFormsId(row.id)
        message.success('删除成功')
        getList()
      }
      catch {
        message.error('删除失败')
      }
    },
  })
}
</script>

<template>
  <div class="space-y-4">
    <QueryForm />
    <n-card>
      <n-button type="primary" @click="handleAdd">新增表单</n-button>
      <Table class="mt-2" />
    </n-card>
  </div>
</template>
