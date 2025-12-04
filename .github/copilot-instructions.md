# 项目开发规范

## 组件和工具使用规则

### 表单实现
**重要**：当需要实现表单功能时，**必须优先使用 `useForm` 组合式函数**。
- 适用场景：数据录入表单、查询表单、配置表单等
- 参考文档：`.github/prompts/useForm.prompt.md`

### 数据表格实现
**重要**：当需要实现数据表格功能时，**必须优先使用 `useTable` 组合式函数**。
- 适用场景：列表页面、数据展示、带查询的表格等
- 参考文档：`.github/prompts/useTable.prompt.md`

### 样式
**重要** :系统安装了 unocss 优先使用 unocss 实现样式功能

---

## ESLint 自动修复规则

**重要**：在编辑任何代码文件后，必须按以下顺序执行：

1. 先运行 `pnpm exec eslint <被编辑的文件路径> --fix` 自动修复格式问题（使用相对路径，如：`pnpm exec eslint src/pages/test/a/index.vue --fix`）
2. 然后运行 `get_errors()` 检查剩余错误
3. 最后手动修复类型错误等无法自动修复的问题

**禁止**直接在编辑后就运行 `get_errors()`，必须先运行 lint fix。
**禁止**使用 `pnpm run lint --fix` 对整个项目运行，应该针对具体编辑的文件运行。
**说明**：项目本地已安装 eslint (devDependencies)，使用 `pnpm exec` 调用本地版本。

