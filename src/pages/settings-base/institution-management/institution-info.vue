<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import type { FormItemProps } from '~/components/form-item'

definePage({
  meta: {
    title: '机构信息',
    keepAlive: false,
    hideInMenu: true,
    order: 1,
  },
})

const message = useMessage()
const router = useRouter()
const [Form, form, formRef] = useForm()

const items: FormItemProps[] = [
  {
    label: '机构名称',
    field: 'institutionName',
    component: 'n-input',
    value: '区域体检机构管理',
    props: { placeholder: '请输入机构名称' },
    rule: yup.string().required('机构名称不能为空'),
  },
  {
    label: '机构logo',
    field: 'logoImage',
    component: 'n-upload',
    value: [],
  },
  {
    label: '登陆页壁纸',
    field: 'wallpaperImage',
    component: 'n-upload',
    value: [],
  },
  {
    label: '所属地区',
    field: 'region',
    component: 'n-cascader',
    rule: yup.array().min(1, '请选择所属地区'),
  },
  {
    label: '详细地址',
    field: 'address',
    component: 'n-input',
    value: '广州市海珠区巴岗中园',
    props: { placeholder: '请输入详细地址' },
    rule: yup.string().required('详细地址不能为空'),
  },
  {
    label: '机构描述',
    field: 'description',
    component: 'n-input',
    props: {
      type: 'textarea',
      rows: 5,
      maxlength: 500,
      showCount: true,
    },
    formItemProps: { class: 'col-span-2' },
  },
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    // TODO: 调用 API 提交数据
    message.success('提交成功')
  }
  catch {
    message.error('请检查表单填写')
  }
}

function handleBack() {
  router.back()
}
</script>

<template>
  <div class="p-4">
    <n-card title="机构信息">
      <Form.Root label-placement="left" label-width="100">
        <Form.ItemGrid :items="items" class="grid-cols-2" />

        <n-space class="mt-6">
          <n-button @click="handleBack">
            返回
          </n-button>
          <n-button type="primary" @click="handleSubmit">
            提交
          </n-button>
        </n-space>
      </Form.Root>
    </n-card>
  </div>
</template>
