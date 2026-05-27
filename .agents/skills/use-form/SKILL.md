---
name: use-form
description: 基于 Naive UI 的配置化表单组合式函数，支持 Schema 定义、自动验证、布局控制和多种内置组件。
license: MIT
metadata:
    author: OpenCode
    version: "1.0"
compatibility: Requires Vue 3 + Naive UI project
---

# useForm

基于 Naive UI Form 的声明式表单组合式函数，通过 Schema 配置快速生成表单，内置常用组件映射、布局控制和验证功能。

## 目录

- [基础用法](references/basic-usage.md) - 标准表单页面创建
- [弹窗模式](references/modal-patterns.md) - 模态框中的表单 (useFormModal / usePromiseModal)
- [Schema 配置](references/schema-config.md) - 字段定义、验证规则、动态属性
- [组件映射](references/component-map.md) - **(请阅读源码 src/constants/FORM_ITEM_COMPONENT_MAP.ts)**
- [高级布局](references/advanced-layout.md) - Tabs、Collapse 和自定义插槽布局
- [生成器指南](references/generator.md) - AI 代码生成规范

## 快速开始

```tsx
const [Form, form, formRef] = useForm<FormData>()

const items = [
  { label: 'Name', field: 'name', component: 'n-input', rule: yup.string().required() }
]

// Template
<Form.Root>
  <Form.ItemGrid :items="items" />
</Form.Root>
```

## 适用场景

- **常规表单**: 数据录入、编辑页面。
- **弹窗表单**: 快速创建增删改查弹窗。
- **动态表单**: 字段联动、条件显隐。

## 触发关键词

当用户提到以下内容时，应使用此 Skill：

- "创建表单"
- "使用 useForm"
- "添加编辑弹窗"
- "生成注册页面"
