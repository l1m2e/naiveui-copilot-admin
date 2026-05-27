---
name: use-table
description: Declarative data table composable based on Naive UI DataTable with query form, pagination, sorting, filtering, and column settings persistence.
license: MIT
metadata:
    author: OpenCode
    version: "1.0"
compatibility: Requires Vue 3 + Naive UI project
---

# useTable

基于 Naive UI DataTable 的声明式表格组合式函数，内置查询表单、分页、排序、筛选和列配置持久化功能。

## 适用场景

- 用户说需要使用 useTable 实现页面的时候

使用 useTable 前，请先查阅 [核心 API](references/core-api.md) 了解基本用法，再根据需要查看各功能模块的详细文档。

## 核心 API

| 功能 | 说明 | 文档 |
|------|------|------|
| 基础用法 | 最简单的表格创建方式 | [基础用法](references/basic-usage.md) |
| 返回值 | QueryForm, Table, getList 等 | [核心 API](references/core-api.md) |
| 配置选项 | api, columns, pagination 等 | [配置选项](references/options.md) |

## 查询表单

| 功能 | 说明 | 文档 |
|------|------|------|
| 静态配置 | 固定表单项配置 | [查询表单](references/query-form.md) |
| 动态配置 | 使用 computed 动态生成 | [查询表单](references/query-form.md) |
| 组件类型 | 各种 FormItem 组件 | [查询表单](references/query-form.md#formitem-组件类型) |

## 数据与分页

| 功能 | 说明 | 文档 |
|------|------|------|
| 分页启用 | pagination: true | [分页](references/pagination.md) |
| 延迟加载 | immediate: false | [分页](references/pagination.md#延迟加载) |
| 自定义字段 | dataField, totalField | [分页](references/pagination.md#自定义数据字段) |

## 表格列

| 功能 | 说明 | 文档 |
|------|------|------|
| 列配置 | title, key, width, align | [列配置](references/columns.md) |
| 排序 | sorter, defaultSortOrder | [排序](references/sorting.md) |
| 筛选 | filter, filterOptions | [筛选](references/filtering.md) |
| 自定义渲染 | render 函数 | [自定义渲染](references/rendering.md) |
| 选择列 | type: 'selection' | [列配置](references/columns.md) |
| 列设置持久化 | columnSettings | [列设置](references/column-settings.md) |

## 高级用法

| 功能 | 说明 | 文档 |
|------|------|------|
| 多表格 | 同一页面多个实例 | [高级用法](references/advanced.md) |
| 属性透传 | row-key, max-height 等 | [高级用法](references/advanced.md#表格属性透传) |
| TypeScript | 泛型类型推断 | [高级用法](references/advanced.md#typescript-泛型) |

## 常用模式

| 功能 | 说明 | 文档 |
|------|------|------|
| 操作列 | 编辑/删除/详情按钮 | [常用模式](references/patterns.md) |
| 状态开关 | 联 API 调用的开关 | [常用模式](references/patterns.md#状态开关联动-api) |
| 数组展示 | join, 嵌套数组等 | [常用模式](references/patterns.md#数组展示) |
| 空值处理 | 默认值显示 | [常用模式](references/patterns.md#空值默认值) |

## 内部架构

| 模块 | 职责 | 文档 |
|------|------|------|
| useSorter | 排序状态管理 | [架构](references/architecture.md) |
| useFilter | 筛选状态管理 | [架构](references/architecture.md) |
| useColumns | 列处理与持久化 | [架构](references/architecture.md) |
| useTableDataFetcher | 数据请求处理 | [架构](references/architecture.md) |

## 完整示例

完整的使用示例，涵盖查询表单、分页、操作列等常用功能：

- [完整业务示例](references/complete-example.md)

## 工具

### 表格页面生成器

当需要根据用户描述或图片自动生成表格页面时使用：

| 功能 | 说明 | 文档 |
|------|------|------|
| 需求分析 | 分析用户描述、图片提取关键信息 | [需求分析](references/generator/requirement-analysis.md) |
| 接口查找 | 从 hooks 目录查找匹配 API | [接口查找](references/generator/api-discovery.md) |
| 配置生成 | 生成 queryFormSchema 和 columns | [配置生成](references/generator/config-generation.md) |
| 代码生成 | 生成完整 Vue 组件代码 | [代码生成](references/generator/code-generation.md) |
| 功能完善 | 添加操作按钮、状态开关等 | [功能完善](references/generator/feature-enhancement.md) |

### 触发场景

- 用户说："创建一个用户管理页面"
- 用户说："需要一个菜品列表"
- 用户说："使用 useTable"
- 用户提供截图要求生成类似页面
- 用户描述："管理表格，带搜索和分页"

### 工作流程

```
用户需求 → 需求分析 → 接口查找 → 配置生成 → 代码生成 → 功能完善
```

### 示例

**用户描述**："需要一个用户管理页面"

**自动执行**：
1. 从 User 模块查找列表接口（useUserGetStaffList）
2. 分析 API 参数生成查询表单配置
3. 分析返回数据生成表格列配置
4. 生成完整页面代码

### 相关文档

- [useTable 详细文档](references/core-api.md)
