# 高级布局

虽然 `Form.ItemGrid` 可以处理大多数网格布局，但复杂的表单通常需要更多的结构。

## 使用 Tabs 分组

你可以将表单项拆分到不同的 Tab 页中，同时保持同一个 `Form.Root` 和 `form` 数据模型。

```tsx
<template>
  <Form.Root>
    <n-tabs type="line">
      <n-tab-pane name="basic" tab="基本信息">
        <!-- 基本信息 Grid -->
        <Form.ItemGrid :items="basicItems" />
      </n-tab-pane>

      <n-tab-pane name="details" tab="详细信息">
        <!-- 详细信息 Grid -->
        <Form.ItemGrid :items="detailItems" />
      </n-tab-pane>
    </n-tabs>
  </Form.Root>
</template>
```

## 折叠面板 (Collapse)

使用 `n-collapse` 来组织长表单。

```tsx
<template>
  <Form.Root>
    <n-collapse>
      <n-collapse-item title="第一部分" name="1">
        <Form.ItemGrid :items="section1Items" />
      </n-collapse-item>

      <n-collapse-item title="第二部分" name="2">
        <Form.ItemGrid :items="section2Items" />
      </n-collapse-item>
    </n-collapse>
  </Form.Root>
</template>
```

## 手动使用 `Form.Item`

如果 `Form.ItemGrid` 过于受限，你可以直接使用 `Form.Item`。

```tsx
<template>
  <Form.Root>
    <div class="custom-layout">
      <div class="sidebar">
        <Form.Item
          label="头像"
          field="avatar"
          component="upload-image"
        />
      </div>

      <div class="main-content">
        <Form.ItemGrid :items="mainItems" />
      </div>
    </div>
  </Form.Root>
</template>
```

## 自定义插槽

通过 Schema 中的 `slots` 属性将插槽传递给组件。

```tsx
{
  label: '价格',
  field: 'price',
  component: 'n-input-number',
  slots: {
    suffix: () => '元',
    prefix: () => '¥'
  }
}
```
