<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import { ref } from 'vue'

const [Form, form, formRef] = useForm<Record<string, any>>()
const items = ref<FormItemProps[]>([
  { label: '标签1', field: 'tag1', component: 'n-input' },
])

function addField() {
  const index = items.value.length + 1
  items.value.push({ label: `标签${index}`, field: `tag${index}`, component: 'n-input' })
}

function removeLastField() {
  items.value.pop()
}

defineExpose({
  Form,
  form,
  formRef,
  items,
  addField,
  removeLastField,
})
</script>

<template>
  <Form.Root>
    <Form.ItemGrid :items="items" class="grid-cols-2" />
  </Form.Root>
</template>
