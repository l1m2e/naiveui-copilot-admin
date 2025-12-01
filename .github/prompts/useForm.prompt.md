# useForm 表单构建提示词

## 任务
根据用户提供的表单截图/设计图,使用 `useForm` 生成 Vue 3 表单代码。

## 图片分析

### 1. 识别字段信息
按从上到下、从左到右顺序识别:
- 标签文本、字段类型、占位符、默认值
- 必填标记 (红色 `*`)
- 布局信息 (每行几列、字段跨列)

### 2. 组件类型映射

| 视觉特征 | 组件类型 | useForm 配置 |
|---------|---------|-------------|
| 单行文本框,有边框 | 文本输入 | `n-input` |
| 多行文本框,可滚动 | 文本域 | `n-input` + `props: { type: 'textarea' }` |
| 数字输入框,带 +/- 按钮 | 数字输入 | `n-input-number` |
| 下拉选择框,带向下箭头 | 下拉选择 | `n-select` |
| 日历图标,点击弹出日期选择器 | 日期选择 | `n-date-picker` |
| 时钟图标,时间选择 | 时间选择 | `n-time-picker` |
| 勾选框 ☑ | 复选框 | `n-checkbox` |
| 切换开关 (ON/OFF) | 开关 | `n-switch` |
| 单选圆圈 ⭕ | 单选框 | `n-radio` 或 `n-radio-group` |
| 星星评分 ⭐⭐⭐ | 评分 | `n-rate` |
| 滑动条 ━━━●━━ | 滑块 | `n-slider` |
| 标签列表,可添加删除 | 动态标签 | `n-dynamic-tags` |
| 上传按钮 + 文件列表 | 文件上传 | `n-upload` |
| 级联选择 (省/市/区) | 级联选择器 | `n-cascader` |
| 树形选择 | 树形选择器 | `n-tree-select` |
| 颜色块 + 颜色选择器 | 颜色选择器 | `n-color-picker` |

### 3. 验证规则
- 必填 `*` → `rule: yup.string().required('必填')`
- 邮箱 → `yup.string().email('格式错误')`
- 手机 → `yup.string().phone('格式错误')`
- 数字范围 → `yup.number().min(n).max(n)`

### 4. 布局分析
- 统计每行几列 → `grid-cols-N`
- 字段跨列 → `formItemProps: { class: 'col-span-N' }`
- 标签位置 → `label-placement="left"` 或 `"top"`

## 代码模板

```vue
<script setup lang="ts">
import type { FormItemProps } from '~/components/form-item'

const message = useMessage()
const [Form, form, formRef] = useForm()

const items: FormItemProps[] = [
  {
    label: '字段标签',
    field: 'fieldName', // 驼峰命名
    component: 'n-input',
    value: 默认值, // 可选
    props: {}, // 可选
    rule: yup.string().required('必填'), // 可选
    formItemProps: { class: 'col-span-2' }, // 跨列时使用
  },
  // ... 更多字段
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    console.log('表单数据:', form.value)
    message.success('提交成功')
  }
  catch {
    message.error('请检查表单')
  }
}
</script>

<template>
  <Form.Root label-placement="top">
    <Form.ItemGrid :items="items" class="grid-cols-2 gap-4" />

    <n-space class="mt-4">
      <n-button @click="formRef?.reset()">重置</n-button>
      <n-button type="primary" @click="handleSubmit">提交</n-button>
    </n-space>
  </Form.Root>
</template>
```

## 常用字段配置

```ts
// 文本输入
{ label: '用户名', field: 'username', component: 'n-input', props: { placeholder: '请输入' } }

// 文本域 (占2列)
{ label: '简介', field: 'description', component: 'n-input',
  props: { type: 'textarea', rows: 4 }, formItemProps: { class: 'col-span-2' } }

// 数字
{ label: '年龄', field: 'age', component: 'n-input-number', props: { min: 1, max: 150 } }

// 下拉
{ label: '性别', field: 'gender', component: 'n-select',
  props: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } }

// 日期/时间
{ label: '日期', field: 'date', component: 'n-date-picker', props: { type: 'date' } }
{ label: '时间', field: 'time', component: 'n-time-picker' }

// 开关/复选框 (必须设置 value)
{ label: '启用', field: 'enabled', component: 'n-switch', value: true }
{ label: '同意', field: 'agreed', component: 'n-checkbox', value: false }

// 数组类型 (必须设置 value: [])
{ label: '标签', field: 'tags', component: 'n-dynamic-tags', value: [] }
{ label: '上传', field: 'files', component: 'n-upload', value: [], props: { action: '/upload' } }

// 其他
{ label: '评分', field: 'rating', component: 'n-rate', value: 0 }
{ label: '颜色', field: 'color', component: 'n-color-picker', value: '#18a058' }
{ label: '地区', field: 'region', component: 'n-cascader', props: { options: [] } }
```

## 关键注意事项

### 1. 必须设置默认值的组件
- **数组类型**: `n-dynamic-tags`, `n-upload`, `n-transfer` → `value: []`
- **布尔类型**: `n-switch`, `n-checkbox` → `value: true/false`
- **数字类型**: `n-rate`, `n-slider` → `value: 0` 或具体数字

### 2. 必须提供 props 的组件
- `n-select` → `props: { options: [] }`
- `n-cascader` → `props: { options: [] }`
- `n-upload` → `props: { action: '/api/upload' }`

### 3. 类型引入规则
- **不需要类型**: 使用 `useForm()` 即可,不定义泛型
- **用户指定类型**: 如果用户提供了已有类型名,需手动引入该类型并使用 `useForm<TypeName>()`

### 4. 动态属性
```ts
// props 可以是函数,根据表单数据动态计算
props: (formData) => ({ disabled: !formData.enabled })
```

### 5. 命名规范
- 字段名使用小驼峰: `userName`, `phoneNumber`
- 标签使用中文: `用户名`, `手机号`
