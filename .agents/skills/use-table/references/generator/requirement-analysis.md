# 需求分析

## 输入信息分析

当用户提供需求时，分析以下信息：

### 用户描述

用户可能通过以下方式描述需求：

- **直接描述**："创建一个用户管理页面"、"需要菜品列表"
- **功能描述**："需要一个带搜索的用户列表，支持分页"
- **已有代码**：用户提供部分代码或截图

### 关键信息提取

从描述中提取：

| 信息 | 示例 | 用途 |
|------|------|------|
| 业务模块 | 用户、菜品、订单、科室 | 定位 API 模块 |
| 数据实体 | 用户、菜品、分类、仓库 | 定位具体接口 |
| 功能需求 | 搜索、分页、排序、筛选 | 确定 useTable 配置 |
| 操作需求 | 编辑、删除、详情、状态切换 | 生成操作列 |

## 图片/截图分析

如果用户提供图片或截图，观察：

- 表格列：哪些字段需要展示
- 查询表单：有哪些搜索条件
- 操作按钮：编辑、删除、详情等
- 特殊组件：状态开关、标签、下拉等

## 输出需求规格

根据分析结果，生成需求规格：

```ts
interface TablePageRequirement {
  // 业务信息
  module: string      // 模块名：User/Food/Material/Enterprise 等
  entity: string      // 实体名：Staff/Dish/Material 等
  pageTitle: string   // 页面标题

  // 功能需求
  features: {
    search: boolean   // 是否需要搜索
    pagination: boolean // 是否需要分页
    sorting: boolean  // 是否需要排序
    filtering: boolean // 是否需要筛选
  }

  // 字段信息
  fields: {
    name: string      // 字段名
    type: string      // 类型：string/number/boolean/date
    label: string     // 显示标签
    searchable: boolean // 是否可搜索
    sortable: boolean // 是否可排序
    filterable: boolean // 是否可筛选
  }[]

  // 操作需求
  operations: {
    detail: boolean   // 详情
    edit: boolean     // 编辑
    delete: boolean   // 删除
    status: boolean   // 状态切换
  }
}
```

## 相关文档

- [接口查找](api-discovery.md)
- [配置生成](config-generation.md)
