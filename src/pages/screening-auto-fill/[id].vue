<script lang="tsx" setup>
import type { FormItemProps } from '~/components/form-item'
import * as yup from 'yup'
import MarkdownEditor from '~/components/markdown-editor/index.vue'
import MonacoEditor from '~/components/monaco-editor/index.vue'

definePage({
  meta: {
    title: '筛评填写详情',
    isMenu: false,
  },
})

const message = useMessage()
const router = useRouter()
const route = useRoute()

const id = computed(() => (route.params as { id: string }).id)
const isNew = computed(() => id.value === 'new')

const [Form, form, formRef] = useForm({
  init: {
    name: '',
    formKey: '',
    prompt: '',
    schema: '',
  },
})

const basicItems = computed<FormItemProps[]>(() => [
  {
    label: '表单名称',
    field: 'name',
    component: 'n-input',
    props: { placeholder: '请输入表单名称' },
    rule: yup.string().required('请输入表单名称'),
  },
  {
    label: '表单 Key',
    field: 'formKey',
    component: 'n-input',
    props: { placeholder: '请输入表单 Key，需唯一', disabled: !isNew.value },
    rule: yup.string().required('请输入表单 Key'),
  },
  {
    label: '提示词',
    field: 'prompt',
    component: () => <MarkdownEditor v-model={form.value.prompt} class="h-600px" />,
    rule: yup.string().required('请输入提示词'),
  },
  {
    label: 'Schema 校验',
    field: 'schema',
    component: () => <MonacoEditor v-model={form.value.schema} language="json" class="rounded-xl h-600px overflow-hidden" />,
    rule: yup.string().required('请输入 Schema 校验 JSON'),
  },
])

useLoading(async () => {
  if (isNew.value) return
  const formData = await api.admin.getScreeningAutoFillFormsId(id.value)
  form.value = {
    name: formData.name,
    formKey: formData.formKey,
    prompt: formData.prompt,
    schema: JSON.stringify(formData.schema, null, 2),
  }
}, { immediate: true })

const [submitLoading, handleSubmit] = useLoading(async () => {
  await formRef.value?.validate()
  let schema: Record<string, unknown>
  try {
    schema = JSON.parse(form.value.schema)
  }
  catch {
    message.error('Schema 校验 JSON 格式不正确')
    return
  }
  if (isNew.value) {
    await api.admin.postScreeningAutoFillForms({
      name: form.value.name,
      formKey: form.value.formKey,
      prompt: form.value.prompt,
      schema,
    })
    message.success('创建成功')
  }
  else {
    await api.admin.putScreeningAutoFillFormsId(id.value, {
      name: form.value.name,
      formKey: form.value.formKey,
      prompt: form.value.prompt,
      schema,
    })
    message.success('保存成功')
  }
  router.back()
})
</script>

<template>
  <div class="pb-16 flex flex-col h-full space-y-4">
    <n-card class="flex flex-1 flex-col">
      <Form.Root label-placement="top" class="flex flex-col h-full">
        <Form.ItemGrid :items="basicItems" class="grid-cols-2" />
      </Form.Root>
    </n-card>

    <FooterOperation
      :confirm-text="isNew ? '创建' : '保存'"
      :loading="submitLoading"
      @confirm="handleSubmit"
      @cancel="router.back()"
    />
  </div>
</template>
