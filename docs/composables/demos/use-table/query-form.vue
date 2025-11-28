<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

// 模拟 API
async function mockApi(params: any) {
  const { page = 1, pageSize = 10, keyword = '', status } = params

  // 模拟数据
  let allData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? 1 : 0,
  }))

  // 模拟筛选
  if (keyword) {
    allData = allData.filter(item =>
      item.name.includes(keyword) || item.email.includes(keyword),
    )
  }

  if (status !== undefined && status !== null) {
    allData = allData.filter(item => item.status === status)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    rows: allData.slice(start, end),
    total: allData.length,
  }
}

const queryFormSchema: FormItemProps[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'n-input',
    props: { placeholder: '搜索姓名或邮箱' },
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
]

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '邮箱', key: 'email' },
  {
    title: '状态',
    key: 'status',
    render: (row: any) => (row.status === 1 ? '启用' : '禁用'),
  },
]

const { QueryForm, Table } = useTable({
  api: mockApi,
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
