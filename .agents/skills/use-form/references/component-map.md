# 组件映射

`useForm` 支持的组件类型由项目源码中的常量定义。

**请务必直接阅读以下文件以获取最新、最准确的组件列表和配置：**

`/Users/l1m2e/gs/dietary-cms-forntend/src/constants/FORM_ITEM_COMPONENT_MAP.ts`

该文件定义了：
1.  所有可用的组件 Key（如 `n-input`, `role-selector` 等）。
2.  每个组件对应的 Vue 组件实现。
3.  默认值 (`defaultValue`)。
4.  v-model 绑定的属性名 (`modelValue`)。

在编写 Schema 时，`component` 字段的值必须严格匹配该文件中的 Key。
