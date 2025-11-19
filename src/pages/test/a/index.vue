<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import { h } from 'vue'

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

const [Form, form, formRef] = useForm<Record<string, any>>()

const items: FormItemProps[] = [
  { label: () => `${form.value.input} Input`, field: 'input', component: 'n-input', value: '123' },
  { label: 'AutoComplete', field: 'autocomplete', component: 'n-auto-complete' },
  { label: 'Cascader', field: 'cascader', component: 'n-cascader' },
  { label: 'Color Picker', field: 'color', component: 'n-color-picker' },
  { label: 'Checkbox', field: 'checkbox', component: 'n-checkbox' },
  { label: 'Date Picker', field: 'date', component: 'n-date-picker' },
  { label: 'Dynamic Input', field: 'dynamicInput', component: 'n-dynamic-input' },
  { label: 'Dynamic Tags', field: 'dynamicTags', component: 'n-dynamic-tags' },
  { label: 'Input Number', field: 'inputNumber', component: 'n-input-number' },
  { label: 'Input OTP', field: 'inputOtp', component: 'n-input-otp' },
  { label: 'Mention', field: 'mention', component: 'n-mention' },
  { label: 'Radio', field: 'radio', component: 'n-radio' },
  { label: 'Rate', field: 'rate', component: 'n-rate' },
  { label: 'Select', field: 'select', component: 'n-select' },
  { label: 'Slider', field: 'slider', component: 'n-slider' },
  { label: 'Switch', field: 'isActive', component: 'n-switch' },
  { label: 'Time Picker', field: 'time', component: 'n-time-picker' },
  { label: 'Transfer', field: 'transfer', component: 'n-transfer', formItemProps: { class: 'col-span-3' } },
  { label: 'Tree Select', field: 'treeSelect', component: 'n-tree-select' },
  { label: 'Upload', field: 'upload', component: 'n-upload', slots: { default: () => h('span', '上传文件') } },
]
</script>

<template>
  <n-card>
    <div class="gap-2 grid grid-cols-2">
      <Form.Root>
        <Form.ItemGrid :items="items" class="grid-cols-3" />
      </Form.Root>

      <pre>{{ form }}</pre>
    </div>
  </n-card>
</template>
