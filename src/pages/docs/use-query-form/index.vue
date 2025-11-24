<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'

definePage({
  meta: {
    title: 'useQueryForm',
    order: 2,
  },
})

const items: FormItemProps[] = [
  { label: 'Input1', field: 'input1', component: 'n-input' },
  { label: 'Input2', field: 'input2', component: 'n-input' },
  { label: 'Input3', field: 'input3', component: 'n-input' },
  { label: 'Input4', field: 'input4', component: 'n-input' },
  { label: 'Input5', field: 'input5', component: 'n-input' },
  { label: 'Input6', field: 'input6', component: 'n-input' },
  { label: 'Input7', field: 'input7', component: 'n-input' },
  { label: 'Input8', field: 'input8', component: 'n-input' },
  { label: 'Input9', field: 'input9', component: 'n-input' },
  { label: 'Input10', field: 'input10', component: 'n-input' },
  { label: 'Input11', field: 'input11', component: 'n-input' },
  { label: 'Input12', field: 'input12', component: 'n-input' },
]

const queryFormRef = useTemplateRef('queryFormRef')

// 模拟异步查询函数
async function search(query: any) {
  console.log('query', query)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({})
    }, 1000)
  })
}
</script>

<template>
  <n-card title="UseQueryForm Test">
    <QueryForm ref="queryFormRef" :items="items" :search="search" />

    <n-divider />
    <h3 class="font-bold mb-2">Form Data:</h3>
    <pre class="p-2 rounded bg-gray-100">{{ queryFormRef?.form }}</pre>
  </n-card>
</template>
s
