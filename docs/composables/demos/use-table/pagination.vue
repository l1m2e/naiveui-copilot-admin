<script setup lang="ts">
// 模拟分页 API
async function mockApi(params: any) {
  const { page = 1, pageSize = 10 } = params

  // 模拟数据
  const allData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? '启用' : '禁用',
  }))

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    rows: allData.slice(start, end),
    total: allData.length,
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '邮箱', key: 'email' },
  { title: '状态', key: 'status' },
]

const { Table } = useTable({
  api: mockApi,
  columns,
  pagination: true,
})
</script>

<template>
  <Table />
</template>
