<script lang="tsx" setup>
import { getAdminScreeningAutoFillFormsId, postAdminScreeningAutoFillForms, putAdminScreeningAutoFillFormsId } from '~/api/generated'
import MarkdownEditor from '~/components/markdown-editor/index.vue'

definePage({
  meta: {
    title: '筛评填写详情',
    isMenu: false,
  },
})

const message = useMessage()
const router = useRouter()
const route = useRoute()

const formRef = ref(null)

const id = computed(() => (route.params as { id: string }).id)
const isNew = computed(() => id.value === 'new')
const pageTitle = computed(() => (isNew.value ? '新增表单' : '编辑表单'))

const formValue = ref<{
  name: string
  formKey: string
  prompt: string
  schema: string
}>({
  name: '',
  formKey: '',
  prompt: '',
  schema: '',
})

const rules = {
  name: { required: true, message: '请输入表单名称', trigger: 'blur' },
  formKey: { required: true, message: '请输入表单 Key', trigger: 'blur' },
  prompt: { required: true, message: '请输入提示词', trigger: 'blur' },
  schema: { required: true, message: '请输入 Schema 校验 JSON', trigger: 'blur' },
}

async function loadForm() {
  if (isNew.value) return
  try {
    const form = await getAdminScreeningAutoFillFormsId(id.value)
    formValue.value = {
      name: form.name,
      formKey: form.formKey,
      prompt: form.prompt,
      schema: JSON.stringify(form.schema, null, 2),
    }
  }
  catch {
    message.error('加载表单失败')
    router.back()
  }
}

function handleSchemaInput(value: string) {
  formValue.value.schema = value
}

async function handleSubmit() {
  await (formRef.value as any)?.validate()
  let schema: Record<string, unknown>
  try {
    schema = JSON.parse(formValue.value.schema)
  }
  catch {
    message.error('Schema 校验 JSON 格式不正确')
    return
  }

  try {
    if (isNew.value) {
      await postAdminScreeningAutoFillForms({
        name: formValue.value.name,
        formKey: formValue.value.formKey,
        prompt: formValue.value.prompt,
        schema,
      })
      message.success('创建成功')
    }
    else {
      await putAdminScreeningAutoFillFormsId(id.value, {
        name: formValue.value.name,
        formKey: formValue.value.formKey,
        prompt: formValue.value.prompt,
        schema,
      })
      message.success('保存成功')
    }
    router.back()
  }
  catch {
    message.error(isNew.value ? '创建失败' : '保存失败')
  }
}

loadForm()
</script>

<template>
  <div class="space-y-4">
    <n-card :title="pageTitle">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="120"
        class="max-w-800px"
      >
        <n-form-item label="表单名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入表单名称" />
        </n-form-item>
        <n-form-item label="表单 Key" path="formKey">
          <n-input v-model:value="formValue.formKey" placeholder="请输入表单 Key，需唯一" :disabled="!isNew" />
        </n-form-item>
        <n-form-item label="提示词" path="prompt">
          <MarkdownEditor
            v-model="formValue.prompt"
            placeholder="请输入 AI 自动填写的提示词"
            :min-height="200"
          />
        </n-form-item>
        <n-form-item label="Schema 校验" path="schema">
          <n-input
            :value="formValue.schema"
            type="textarea"
            :rows="10"
            placeholder="请输入 JSON Schema（如 {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {...}}）"
            @update:value="handleSchemaInput"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSubmit">
            {{ isNew ? '创建' : '保存' }}
          </n-button>
          <n-button class="ml-2" @click="router.back()">
            取消
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
