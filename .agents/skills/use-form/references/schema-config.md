# Schema 配置

`items` 数组是 `useForm` 的核心配置。在项目中，我们主要有两种定义 Schema 的风格：静态定义和动态定义（Computed）。

## 1. 静态定义 (Static)

当表单项不依赖外部异步数据（如固定的下拉选项、纯输入框）时，直接定义为常量或变量。

```tsx
const items: FormItemProps[] = [
  {
    label: '用户名',
    field: 'username',
    component: 'n-input',
    props: { placeholder: '请输入用户名' },
    rule: yup.string().required('请输入用户名')
  },
  {
    label: '类型',
    field: 'type',
    component: 'n-select',
    props: {
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' }
      ]
    }
  }
]
```

## 2. 动态定义 (Computed)

**项目最佳实践**：当表单项的选项（options）来自 API 异步获取的数据时，**必须**使用 `computed` 来定义 `items`，以确保数据加载后下拉菜单能自动更新。

```tsx
// 1. 获取异步数据
const { state: classifyOptions } = useAsyncState(async () => {
  const { data } = await api.foodGetDishClassifyList({})
  return data
}, [])

// 2. 使用 computed 定义 schema
const items = computed<FormItemProps[]>(() => [
  {
    label: '菜品名称',
    field: 'name',
    component: 'n-input',
  },
  {
    label: '菜品分类',
    field: 'classify_id',
    component: 'n-tree-select',
    // 动态引用 classifyOptions.value
    props: {
      clearable: true,
      options: classifyOptions.value,
      labelField: 'name',
      valueField: 'id',
      keyField: 'id',
      placeholder: '请选择分类'
    }
  }
])
```

## 3. 属性详解

每个 Schema 项支持以下属性：

| 属性        | 类型                           | 说明                                                                     |
| ----------- | ------------------------------ | ------------------------------------------------------------------------ |
| `field`     | `string`                       | 数据绑定路径，支持嵌套 (如 `user.info.name`)。                           |
| `label`     | `string`                       | 表单项显示的标签。                                                       |
| `component` | `string`                       | 组件 Key (见 [组件映射](component-map.md))。                             |
| `props`     | `object \| (form) => object`   | 组件属性。支持对象或函数。常用：`placeholder`, `clearable`, `disabled`。 |
| `rule`      | `Yup.Schema`                   | 验证规则。                                                               |
| `grid`      | `string`                       | Tailwind 类名，用于控制跨列 (如 `col-span-2`)。                          |
| `if`        | `boolean \| (form) => boolean` | `v-if` 控制。                                                            |
| `show`      | `boolean \| (form) => boolean` | `v-show` 控制。                                                          |
| `slots`     | `object`                       | 传递插槽，如 `{ suffix: () => '元' }`。                                  |

## 4. 常用模式示例

### 动态 Props (联动控制)

根据表单的其他值动态改变属性（如禁用、占位符）。

```tsx
{
  field: 'password',
  component: 'n-input',
  // 使用函数接收当前 form 数据
  props: (form) => ({
    disabled: form.loginType === 'sms',
    placeholder: form.loginType === 'sms' ? '无需密码' : '请输入密码'
  })
}
```

### Grid 布局控制

项目通常在 `<Form.ItemGrid>` 上设置主网格（如 `grid-cols-3`），然后在个别 Item 上使用 `grid` 属性进行跨列。

```tsx
// Template: <Form.ItemGrid :items="items" class="grid-cols-3" />

const items = [
  // 默认占 1 列
  { field: 'name', component: 'n-input' },
  // 占据 3 列 (整行)
  {
    field: 'description',
    component: 'n-input',
    props: { type: 'textarea' },
    grid: 'col-span-3'
  }
]
```

### 验证规则 (Yup)

项目统一使用 `yup`。

```tsx
import * as yup from 'yup'

{
  field: 'phone',
  component: 'n-input',
  rule: yup.string()
    .required('手机号不能为空')
    .matches(/^1[3-9]\d{9}$/, '请输入正确的手机号')
}
```
