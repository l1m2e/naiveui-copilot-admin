<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

const message = useMessage()
const [Form] = useForm()

const items = ref<FormItemProps[]>([
  { label: '标签 1', field: 'tag1', component: 'n-input', value: '默认值' },
])

function addField() {
  const index = items.value.length + 1
  items.value.push({
    label: `标签 ${index}`,
    field: `tag${index}`,
    component: 'n-input',
  })
  message.success(`添加了字段：tag${index}`)
}

function removeLastField() {
  if (items.value.length <= 1) {
    message.warning('至少保留一个字段')
    return
  }
  const removed = items.value.pop()
  message.info(`删除了字段：${removed?.field}`)
}
</script>

<template>
  <div>
    <n-space class="mb-4">
      <n-button type="primary" @click="addField">
        <template #icon>
          <div class="i-lucide-plus" />
        </template>
        添加字段
      </n-button>
      <n-button @click="removeLastField">
        <template #icon>
          <div class="i-lucide-minus" />
        </template>
        删除最后一个字段
      </n-button>
    </n-space>

    <Form.Root>
      <Form.ItemGrid :items="items" class="grid-cols-2" />
    </Form.Root>
  </div>
</template>
