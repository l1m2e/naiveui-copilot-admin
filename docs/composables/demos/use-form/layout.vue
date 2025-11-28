<script setup lang="tsx">
import type { FormItemProps } from '~/components/form-item'
import { h } from 'vue'

const [Form, _form] = useForm<Record<string, any>>()

const items: FormItemProps[] = [
  {
    label: '标题',
    field: 'title',
    component: 'n-input',
    formItemProps: { class: 'col-span-2' }, // 占据 2 列
  },
  {
    label: '类别',
    field: 'category',
    component: 'n-select',
    props: {
      options: [
        { label: '技术', value: 'tech' },
        { label: '生活', value: 'life' },
        { label: '其他', value: 'other' },
      ],
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'n-input',
    props: { type: 'textarea', rows: 3 },
    formItemProps: { class: 'col-span-3' }, // 占据整行
  },
  {
    label: '上传文件',
    field: 'files',
    component: 'n-upload',
    formItemProps: { class: 'col-span-3' },
    slots: {
      default: () => h('span', { class: 'text-sm' }, '点击或拖拽文件到此区域上传'),
    },
  },
]
</script>

<template>
  <div class="space-y-4">
    <Form.Root>
      <Form.ItemGrid :items="items" class="gap-4 grid-cols-3" />
    </Form.Root>
  </div>
</template>
