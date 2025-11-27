<script lang="tsx" setup>
import { fetchUserList } from './query'

definePage({
  meta: {
    title: '测试 A',
    icon: 'i-carbon-flash-filled',
    order: 1,
    permissions: [
      { label: '测试按钮A', value: 'test:add' },
    ],
  },
})

const { Table, QueryForm } = useTable({
  api: fetchUserList,
  pagination: true,
  queryFormSchema: [
    { label: 'Input1', field: 'input1', component: 'n-input' },
    { label: 'Input2', field: 'input2', component: 'n-input' },
    { label: 'Input3', field: 'input3', component: 'n-input' },
    { label: 'Input4', field: 'input4', component: 'n-input' },
    { label: 'Input5', field: 'input5', component: 'n-input' },
    { label: 'Input6', field: 'input6', component: 'n-input' },
    { label: 'Input7', field: 'input7', component: 'n-input' },
    { label: 'Input8', field: 'input8', component: 'n-input' },
    { label: 'Input9', field: 'input9', component: 'n-input' },
  ],
  columns: [
    { title: 'name', key: 'name' },
    { title: 'status', key: 'status', width: '2000px' },
    { title: 'createTime', key: 'createTime' },
    {
      title: 'phone',
      key: 'phone',
      filterMultiple: false,
      width: '200px',
      filter: true,
      filterOptions: [
        { label: 'London', value: 'London' },
        { label: 'New York', value: 'New York' },
      ],
      fixed: 'right',
    },
  ],
})
</script>

<template>
  <QueryForm />

  <n-card class="mt-2">
    <Table />
  </n-card>
</template>
