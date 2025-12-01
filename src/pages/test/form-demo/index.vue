<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

definePage({
  meta: {
    title: 'Form Demo',
    icon: 'i-carbon-idea',
    order: 3,
  },
})

const message = useMessage()
const [Form, form, formRef] = useForm()

// 计算 BMI
function calculateBMI() {
  const height = form.value.height
  const weight = form.value.weight
  if (height && weight) {
    const heightInMeters = height / 100
    form.value.bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2)
  }
  else {
    form.value.bmi = ''
  }
}

const items: FormItemProps[] = [
  {
    label: '姓名',
    field: 'name',
    component: 'n-input',
    props: { placeholder: '请输入姓名' },
    rule: yup.string().required(),
  },
  {
    label: '证件类型',
    field: 'idType',
    component: 'n-select',
    value: '身份证',
    props: {
      options: [
        { label: '身份证', value: '身份证' },
        { label: '护照', value: '护照' },
        { label: '港澳通行证', value: '港澳通行证' },
      ],
    },
  },
  {
    label: '证件号',
    field: 'idNumber',
    component: 'n-input',
    props: { placeholder: '请输入证件号' },
  },
  {
    label: '年龄',
    field: 'age',
    component: 'n-input-number',
    props: { placeholder: '请输入', min: 0, max: 150 },
  },
  {
    label: '',
    field: 'ageUnit',
    component: 'n-select',
    value: '岁',
    props: {
      options: [
        { label: '岁', value: '岁' },
        { label: '月', value: '月' },
      ],
      class: 'w-24',
    },
    formItemProps: { class: 'label-hidden' },
  },
  {
    label: '出生日期',
    field: 'birthday',
    component: 'n-date-picker',
    props: { type: 'date', placeholder: '请选择日期' },
  },
  {
    label: '性别',
    field: 'gender',
    component: 'n-select',
    props: {
      placeholder: '请选择',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    label: '标签',
    field: 'tags',
    component: 'n-select',
    props: {
      placeholder: '请选择',
      options: [
        { label: '标签1', value: 'tag1' },
        { label: '标签2', value: 'tag2' },
      ],
    },
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'n-input',
    props: { placeholder: '请输入手机号' },
    rule: yup.string().required('必填'),
  },
  {
    label: '入群类型',
    field: 'groupType',
    component: 'n-select',
    props: {
      placeholder: '请选择',
      options: [
        { label: '类型1', value: 'type1' },
        { label: '类型2', value: 'type2' },
      ],
    },
  },
  {
    label: '身高',
    field: 'height',
    component: 'n-input',
    props: {
      placeholder: '请输入身高',
      suffix: 'cm',
      onInput: calculateBMI,
    },
  },
  {
    label: '体重',
    field: 'weight',
    component: 'n-input',
    props: {
      placeholder: '请输入体重',
      suffix: 'kg',
      onInput: calculateBMI,
    },
  },
  {
    label: 'BMI',
    field: 'bmi',
    component: 'n-input',
    props: {
      readonly: true,
      placeholder: '根据身高体重自动计算',
    },
  },
  {
    label: '民族',
    field: 'ethnicity',
    component: 'n-select',
    props: {
      placeholder: '请选择',
      options: [
        { label: '汉族', value: '汉族' },
        { label: '回族', value: '回族' },
        { label: '藏族', value: '藏族' },
      ],
    },
  },
  {
    label: '国家',
    field: 'country',
    component: 'n-select',
    value: '中国',
    props: {
      options: [
        { label: '中国', value: '中国' },
        { label: '美国', value: '美国' },
      ],
    },
  },
  {
    label: '地区',
    field: 'region',
    component: 'n-cascader',
    value: ['广东省', '广州市', '番禺区'],
    props: {
      placeholder: '请选择',
      options: [
        {
          label: '广东省',
          value: '广东省',
          children: [
            {
              label: '广州市',
              value: '广州市',
              children: [
                { label: '天河区', value: '天河区' },
                { label: '番禺区', value: '番禺区' },
                { label: '海珠区', value: '海珠区' },
              ],
            },
            {
              label: '深圳市',
              value: '深圳市',
              children: [
                { label: '南山区', value: '南山区' },
                { label: '福田区', value: '福田区' },
              ],
            },
          ],
        },
        {
          label: '北京市',
          value: '北京市',
          children: [
            { label: '朝阳区', value: '朝阳区' },
            { label: '海淀区', value: '海淀区' },
          ],
        },
      ],
    },
  },
  {
    label: '过敏食物',
    field: 'allergyFood',
    component: 'n-input',
    props: { placeholder: '请输入过敏食物' },
    formItemProps: { class: 'col-span-3' },
  },
  {
    label: '详细地址',
    field: 'address',
    component: 'n-input',
    props: { placeholder: '请输入详细地址' },
    formItemProps: { class: 'col-span-3' },
  },
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    // 表单验证通过,可以提交数据
    message.success('提交成功')
  }
  catch {
    message.error('请检查表单')
  }
}

function handleReset() {
  formRef.value?.reset()
  message.info('已重置')
}
</script>

<template>
  <div class="p-6">
    <n-card title="基本信息">
      <Form.Root label-placement="top">
        <Form.ItemGrid :items="items" class="gap-4 grid-cols-3" />

        <n-space class="mt-6">
          <n-button @click="handleReset">
            重置
          </n-button>
          <n-button type="primary" @click="handleSubmit">
            提交
          </n-button>
        </n-space>
      </Form.Root>
    </n-card>
  </div>
</template>

<style scoped>
:deep(.label-hidden .n-form-item-label) {
  display: none;
}
</style>
