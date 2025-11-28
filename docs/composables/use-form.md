# useForm

`useForm` 是一个基于 Naive UI 的声明式表单 Composable，提供了简洁的 API 来创建和管理表单。它集成了表单验证（Yup）、自动重置、动态表单等功能。

## 特性

- 🎯 **声明式配置** - 通过配置数组快速创建表单
- ✅ **集成 Yup** - 自动将 Yup schema 转换为 Naive UI 规则
- 🔄 **智能重置** - 根据组件类型自动选择正确的重置值
- 📦 **支持所有 Naive UI 组件** - 内置 22+ 种表单组件支持
- ⚡️ **异步验证** - 支持远程校验（如用户名唯一性）
- 🎨 **灵活布局** - 基于 Grid 的响应式布局
- 🔥 **TypeScript** - 完整的类型支持

## 基础用法

最简单的表单示例。

<preview path="./demos/use-form/basic.vue"></preview>

## 表单验证

使用 Yup 进行表单验证，支持自定义校验规则。

<preview path="./demos/use-form/validation.vue"></preview>

## 异步验证

支持异步校验，如远程检查用户名唯一性。

<preview path="./demos/use-form/async.vue"></preview>

## 动态表单

动态添加或删除表单字段。

<preview path="./demos/use-form/dynamic.vue"></preview>

## 表单操作

表单重置和提交操作。

<preview path="./demos/use-form/actions.vue"></preview>

## Grid 布局

使用 Grid 布局控制表单项的排列。

<preview path="./demos/use-form/layout.vue"></preview>

## 完整示例

一个包含多种组件和验证的完整表单示例。

<preview path="./demos/use-form/complete.vue"></preview>

## API

### useForm

```ts
const [Form, form, formRef] = useForm<T>()
```

**返回值：**

- `Form` - 表单组件集合
  - `Form.Root` - 表单根组件（Naive UI 的 NForm）
  - `Form.Item` - 表单项组件
  - `Form.ItemGrid` - Grid 布局的表单项组件
- `form` - 响应式表单数据对象
- `formRef` - 表单实例引用，包含以下方法：
  - `validate()` - 验证表单
  - `restoreValidation()` - 清除验证状态
  - `reset()` - 重置表单（智能重置）

### FormItemProps

表单项配置对象：

```ts
interface FormItemProps {
  // 基础属性
  label: string                    // 标签文本
  field: string                    // 字段名
  component: string | Component    // 组件类型

  // 可选属性
  value?: any                      // 默认值
  rule?: YupSchema                 // Yup 验证规则
  props?: object | Function        // 组件属性
  formItemProps?: object           // NFormItem 属性
  slots?: Record<string, Slot>     // 插槽
}
```

### 支持的组件

| 组件字符串 | Naive UI 组件 | 默认值 |
|-----------|--------------|--------|
| `n-input` | NInput | `null` |
| `n-input-number` | NInputNumber | `null` |
| `n-select` | NSelect | `null` |
| `n-date-picker` | NDatePicker | `null` |
| `n-time-picker` | NTimePicker | `null` |
| `n-checkbox` | NCheckbox | `false` |
| `n-switch` | NSwitch | `false` |
| `n-radio` | NRadio | `null` |
| `n-rate` | NRate | `null` |
| `n-slider` | NSlider | `0` |
| `n-dynamic-tags` | NDynamicTags | `[]` |
| `n-dynamic-input` | NDynamicInput | `[]` |
| `n-transfer` | NTransfer | `[]` |
| `n-upload` | NUpload | `[]` |
| `n-cascader` | NCascader | `null` |
| `n-tree-select` | NTreeSelect | `null` |
| `n-color-picker` | NColorPicker | `null` |
| `n-auto-complete` | NAutoComplete | `null` |
| `n-mention` | NMention | `null` |
| `n-input-otp` | NInputOtp | `null` |

## 高级用法

### 自定义组件属性

```vue
<script setup lang="ts">
const items: FormItemProps[] = [
  {
    label: '描述',
    field: 'description',
    component: 'n-input',
    props: {
      type: 'textarea',
      placeholder: '请输入描述',
      rows: 4
    }
  }
]
</script>
```

### 动态属性（根据表单数据）

```vue
<script setup lang="ts">
const items: FormItemProps[] = [
  {
    label: '类型',
    field: 'type',
    component: 'n-select',
    props: { options: [{ label: 'A', value: 'a' }] }
  },
  {
    label: '子类型',
    field: 'subType',
    component: 'n-select',
    // props 可以是函数，接收表单数据
    props: (formData) => ({
      options: formData.type === 'a'
        ? [{ label: 'A1', value: 'a1' }]
        : [{ label: 'B1', value: 'b1' }]
    })
  }
]
</script>
```

### 自定义插槽

```vue
<script setup lang="tsx">
import { h } from 'vue'

const items: FormItemProps[] = [
  {
    label: '上传文件',
    field: 'file',
    component: 'n-upload',
    slots: {
      default: () => h(NButton, null, { default: () => '点击上传' })
    }
  }
]
</script>
```

### 自定义布局

```vue
<template>
  <Form.Root>
    <!-- 3 列网格布局 -->
    <Form.ItemGrid :items="items" class="grid-cols-3 gap-4" />
  </Form.Root>
</template>
```

控制单个表单项占据多列：

```ts
const items: FormItemProps[] = [
  {
    label: '标题',
    field: 'title',
    component: 'n-input',
    formItemProps: { class: 'col-span-2' } // 占据 2 列
  },
  {
    label: '描述',
    field: 'description',
    component: 'n-input',
    formItemProps: { class: 'col-span-3' } // 占据 3 列
  }
]
```

### Yup 验证规则

项目扩展了 Yup，提供了常用的中国本地化验证：

```ts
import * as yup from 'yup'

const items: FormItemProps[] = [
  {
    label: '手机号',
    field: 'phone',
    component: 'n-input',
    rule: yup.string().phone('请输入合法手机号').required('必填')
  },
  {
    label: '价格',
    field: 'price',
    component: 'n-input-number',
    rule: yup.number().positiveNumber(2, '请输入最多2位小数的正数')
  },
  {
    label: '代号',
    field: 'code',
    component: 'n-input',
    rule: yup.string().alphanumeric('只能包含数字和英文')
  }
]
```

### 表单重置逻辑

`reset()` 方法会智能地重置表单：

1. **有 value 属性** - 重置为 value 值
2. **有默认值映射** - 使用组件对应的默认值（如 `n-switch` 重置为 `false`）
3. **其他情况** - 重置为 `null`

这样可以避免数组类型组件（如 `n-dynamic-tags`）重置为 `null` 导致的错误。

## 注意事项

1. **字段名必填** - 每个 FormItem 都需要指定 `field` 属性
2. **类型安全** - 建议为 `useForm` 传入泛型类型以获得完整的类型提示
3. **动态表单** - 动态添加/删除字段时，组件会自动处理数据清理
4. **异步验证** - 使用 Yup 的 `test()` 方法实现异步验证
5. **Grid 布局** - 确保父容器有足够的宽度，否则 grid 布局可能不生效

## 架构与设计

### 设计理念

`useForm` 采用声明式配置和组合式 API 的设计思想，核心理念包括：

- **声明式优先** - 通过配置对象而非命令式代码来定义表单
- **类型安全** - 完整的 TypeScript 支持，泛型约束表单数据类型
- **关注点分离** - 表单状态、验证逻辑、UI 渲染相互独立
- **渐进增强** - 从简单到复杂，逐步添加功能而不增加基础使用成本
- **零配置默认** - 智能默认值和自动推断，减少样板代码

### 整体架构

useForm 采用分层架构设计：

```
┌─────────────────────────────────────────┐
│         useForm Composable              │
│  - 状态管理 (form reactive object)       │
│  - 组件导出 (FormComposition)           │
│  - 表单实例 (formRef with extensions)    │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│      Form Component Layer               │
│  ┌─────────┬──────────┬──────────────┐  │
│  │  Root   │   Item   │   ItemGrid   │  │
│  └─────────┴──────────┴──────────────┘  │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│     Infrastructure Layer                │
│  - Schema Auto Collection               │
│  - Component Registry                   │
│  - Validation Transformer               │
└─────────────────────────────────────────┘
```

### 核心模块

#### 1. 状态管理模块

```ts
const form = ref<T>({} as T)  // 响应式表单数据
const formRef = ref<FormInst | null>(null)  // Naive UI 表单实例引用
```

- **form** - 使用 Vue 3 响应式系统管理表单数据，支持泛型类型约束
- **formRef** - 保留对底层 NForm 实例的引用，提供验证、重置等方法

#### 2. 组件组合模块

useForm 返回一个组件集合（FormComposition），采用命名空间模式：

- `Form.Root` - 基于 NForm 的根组件，负责注入上下文和管理表单模型
- `Form.Item` - 表单项组件，处理单个字段的渲染、绑定和验证
- `Form.ItemGrid` - 批量渲染表单项，支持 Grid 布局

#### 3. Schema 自动采集

通过 Provide/Inject 机制实现表单项的自动注册和生命周期管理：

```ts
const AUTOMATIC_COLLECTION_SCHEMA_KEY = Symbol('AutomaticCollectionSchemaKey')

function useAutomaticCollectionSchema() {
  return {
    collect: (item) => formItems.value.push(item),
    release: (field) => formItems.value = formItems.value.filter(...)
  }
}
```

**设计目的：**
- 自动跟踪所有表单项配置，用于智能重置
- 组件卸载时自动清理数据，避免内存泄漏
- 无需手动维护表单项列表

#### 4. 组件注册表

`FORM_ITEM_COMPONENT_MAP` 维护了所有支持的 Naive UI 组件映射：

```ts
{
  component: Component,    // 组件构造函数
  modelValue: string,      // v-model 绑定的属性名
  defaultValue: any        // 重置时的默认值
}
```

**核心作用：**
- 统一组件接口，屏蔽不同组件的 v-model 差异
- 为智能重置提供类型感知的默认值
- 支持通过字符串标识组件，简化配置

#### 5. 验证转换器

`yupToRule` 函数负责将 Yup schema 转换为 Naive UI 的验证规则：

```ts
function yupToRule(schema: yup.Schema): FormItemRule {
  return {
    required: // 从 schema 中提取
    asyncValidator: async (_, value) => {
      await schema.validate(value)  // 统一使用异步验证
    },
    trigger: ['blur', 'change']
  }
}
```

**关键设计决策：**
- 统一使用 `asyncValidator`，兼容同步和异步验证
- 自动提取 `required` 标志，正确显示必填标记
- 固定触发时机为 `blur` 和 `change`

### 关键设计决策

#### 1. 智能重置策略

重置表单时根据以下优先级选择目标值：

```
1. FormItem 的 value 属性（用户指定的初始值）
   ↓
2. 组件注册表中的 defaultValue（组件类型对应的空值）
   ↓
3. null（通用后备值）
```

这样设计避免了常见问题：
- ❌ 错误：将数组组件重置为 `null`，导致 `.map()` 报错
- ✅ 正确：将 `n-dynamic-tags` 重置为 `[]`

#### 2. 动态属性支持

`FormItemProps.props` 支持函数形式，可以基于表单数据动态计算：

```ts
{
  props: (formData) => ({
    disabled: !formData.enableField,
    options: getOptionsBasedOn(formData.type)
  })
}
```

实现原理：在 `FormItem` 组件中通过 `computed` 实时计算属性。

#### 3. 组件类型多态

`component` 字段支持三种形式：

- **字符串** - 从注册表查找 (`'n-input'`)
- **组件** - 直接使用 Vue 组件
- **函数** - 返回 JSX/VNode，用于复杂自定义场景

这种设计平衡了简洁性和灵活性。

#### 4. 双向绑定抽象

通过组件注册表的 `modelValue` 字段，统一处理不同组件的 v-model：

```ts
const modValueKey = FORM_ITEM_COMPONENT_MAP[component].modelValue
// 'value' for NInput, 'checked' for NCheckbox, 'file-list' for NUpload
```

用户无需关心底层绑定细节。

### 数据流

```
用户配置 FormItemProps[]
      ↓
Form.ItemGrid 或 Form.Item 渲染
      ↓
组件挂载 → 注入 Schema 采集器
      ↓
自动收集配置到 formItems
      ↓
双向绑定 form.value[field]
      ↓
用户交互 → 触发验证 → 更新状态
      ↓
调用 reset() → 根据策略重置
      ↓
组件卸载 → 自动清理数据和 Schema
```

### 扩展性设计

#### 添加新组件支持

只需在 `FORM_ITEM_COMPONENT_MAP` 中注册：

```ts
export const FORM_ITEM_COMPONENT_MAP = {
  // ...
  'n-custom': {
    component: NCustom,
    modelValue: 'value',
    defaultValue: null
  }
}
```

#### 自定义验证规则

通过 Yup 的扩展 API：

```ts
import { addMethod, string } from 'yup'

addMethod(string, 'customRule', function(message) {
  return this.test('custom', message, (value) => {
    // 验证逻辑
  })
})
```

#### 集成第三方组件

直接传入组件实例：

```ts
{
  component: ThirdPartyComponent,
  props: { /* ... */ }
}
```

FormItem 会将其作为普通 Vue 组件处理，通过 `v-model:modelValue` 绑定。


## 相关链接

- [Naive UI Form 文档](https://www.naiveui.com/zh-CN/os-theme/components/form)
- [Yup 验证库文档](https://github.com/jquense/yup)
- [FormItem 组件源码](https://github.com/your-repo/src/components/form-item)
