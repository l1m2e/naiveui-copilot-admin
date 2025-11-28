<script setup lang="ts">
// 模拟 API（支持排序和筛选）
async function mockApi(params: any) {
  const { page = 1, pageSize = 10, sortField, sortOrder, filterName } = params

  // 模拟数据
  let allData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: ['张三', '李四', '王五', '赵六'][i % 4],
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    department: ['技术部', '销售部', '市场部'][i % 3],
  }))

  // 筛选
  if (filterName && filterName.length > 0) {
    allData = allData.filter(item => filterName.includes(item.name))
  }

  // 排序
  if (sortField && sortOrder) {
    allData.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a]
      const bVal = b[sortField as keyof typeof b]
      if (sortOrder === 'ascend') {
        return aVal > bVal ? 1 : -1
      }
      else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    rows: allData.slice(start, end),
    total: allData.length,
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  {
    title: '姓名',
    key: 'name',
    filter: true,
    filterOptions: [
      { label: '张三', value: '张三' },
      { label: '李四', value: '李四' },
      { label: '王五', value: '王五' },
      { label: '赵六', value: '赵六' },
    ],
  },
  {
    title: '年龄',
    key: 'age',
    sorter: true,
  },
  { title: '邮箱', key: 'email' },
  { title: '部门', key: 'department' },
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
