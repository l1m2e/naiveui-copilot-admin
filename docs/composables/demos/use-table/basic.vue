<script setup lang="ts">
// 模拟 API
async function mockApi() {
  return {
    rows: [
      { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
      { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
      { id: 3, name: '王五', age: 25, email: 'wangwu@example.com' },
    ],
  }
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '邮箱', key: 'email' },
]

const { Table } = useTable({
  api: mockApi,
  columns,
})
</script>

<template>
  <Table />
</template>
