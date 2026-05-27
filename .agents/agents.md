### Vue 组件规范

* `defineProps` / `defineEmits` 必须使用 Type 接口定义，`props` 优先响应式解构。
* `v-model` 统一使用 `defineModel`。
* 组件相关 Type 统一放在同目录 `index.ts` 中定义并导出，`index.vue` 仅导入使用。
* 组件命名统一使用 kebab-case。
* 页面组件需使用 `definePage` 宏定义元数据（项目使用 `unplugin-vue-router`）。

### 核心 Composable 规范

* 表单场景优先使用 `useForm`，通过配置数组快速创建，集成 Yup 校验。
* 表格场景优先使用 `useTable`，自动处理分页、查询和列配置（参考 `src/composables/useTable/index.ts`）。
* 状态管理使用 Pinia，Store 文件存放在 `src/stores/`，配合 `pinia-plugin-persistedstate` 实现持久化。

### API 调用规范

* 必须使用 Kubb 生成的 API 方法：

  * 全局 `api` 对象包含自动生成的 hooks 与调用方法。
  * 可直接调用：`orderGetOrderList(data)`。
  * 使用 Hooks：`const { data } = api.useOrderGetOrderListQuery(params)`。
* 禁止手写请求逻辑，统一通过 `src/api/client/index.ts` 调用。

### UI 与样式规范

* UI 框架：优先 Naive UI，特殊需求可用 Reka UI。
* 样式：优先 UnoCSS（原子化 CSS）。
* 组合函数优先使用 VueUse 提供工具函数。

### 目录与数据流

* `src/api/generated/`：Kubb 生成的代码，包含 `hooks/` 和 `types/`。
* `src/pages/`：文件路由，目录即路由路径。
* `src/components/`：通用业务组件。
* `src/utils/`：包含 `yup.ts`（校验增强）及工具类。

### 工作流

* 生成 API：`pnpm generate-api`。
* 开发环境：`pnpm dev`。
* 组件类型检查：`vue-tsc`。

### TypeScript 规范

* 尽量避免使用 `any`，必要时需注明原因。
* 优先使用 `unknown` 或更具体类型。

### 格式与 ESLint

* 可使用保存时自动修复或 `pnpm lint --fix` 修复大部分问题。

### 不确定信息处理

* 对于表述歧义、信息缺失或多种可能解释的请求：

  1. 必须先使用 `vscode_askQuestions` 进行澄清提问。
  2. 提问应简洁、具体，并在可能情况下合并相关问题。
  3. 用户未明确答复前，不得自行假设或继续实现。

### 数据/DOM 获取策略

* 遇到接口文档或 DOM 结构不清晰，或需浏览器环境信息时：

  1. 优先使用 `chrome-devtools-mcp` 获取信息。
  2. 若自动化工具无法获取或信息不完整，可直接向用户提问。
  3. 保证信息准确性优先，必要时辅以用户澄清。
