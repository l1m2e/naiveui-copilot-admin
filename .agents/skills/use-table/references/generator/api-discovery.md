# 接口查找

## 查找策略

当用户未提供接口时，从 `src/api/generated/hooks/` 目录查找合适的 API。

## 查找步骤

### 1. 确定模块

根据用户描述中的业务领域，确定对应的模块目录：

| 业务领域 | 模块目录 | 示例 |
|----------|----------|------|
| 用户相关 | User | 用户管理、员工管理、角色管理 |
| 菜品相关 | Food | 菜品管理、菜品分类、口味管理 |
| 原材料相关 | Material | 原材料、分类、营养素 |
| 企业相关 | Enterprise | 科室、仓库、厨房、区域 |
| 库存相关 | Stock | 仓库、库存、盘点 |
| 系统相关 | System | 打印模板、上传记录、字典 |
| 处方相关 | Prescription | 膳食方案、膳食食谱 |

### 2. 查找列表接口

在对应模块下查找列表接口，命名模式：

```
use{Module}Get{Entity}List
```

例如：
- `useUserGetStaffList` - 员工列表
- `useFoodGetDishList` - 菜品列表
- `useEnterpriseGetDepartmentList` - 科室列表

### 3. 查找 CRUD 相关接口

根据功能需求，查找相关接口：

| 操作 | 命名模式 | 示例 |
|------|----------|------|
| 详情 | use{Module}Get{Entity}Detail | useUserGetStaffDetail |
| 新增 | use{Module}Create{Entity} | useUserCreateStaff |
| 更新 | use{Module}Update{Entity} | useUserUpdateStaff |
| 删除 | use{Module}Delete{Entity} | useEnterpriseDeleteDepartment |
| 状态 | use{Module}Active{Entity} / Change{Entity}Status | useFoodChangeDishStatus |

## 接口匹配示例

### 示例 1：用户管理页面

**用户描述**："需要一个用户管理页面"

**查找过程**：
1. 识别业务：用户管理 → User 模块
2. 查找列表接口：useUserGetStaffList, useUserGetRoleList, useUserGetHuiyuanClientList
3. 根据"管理"语义，推荐 GetStaffList（员工列表）或 GetRoleList（角色列表）
4. 询问用户确认具体需求

**推荐接口**：
```ts
// 主要接口
api: api.userGetStaffList

// 可能需要的 CRUD 接口
api.userGetStaffDetail  // 详情
api.userCreateStaff     // 新增
api.userUpdateStaff     // 更新
api.userActiveStaff     // 状态切换
```

### 示例 2：菜品分类管理

**用户描述**："创建菜品分类管理页面"

**查找过程**：
1. 识别业务：菜品分类 → Food 模块
2. 查找分类列表接口：useFoodGetDishClassifyList
3. 直接匹配，返回推荐

**推荐接口**：
```ts
// 主要接口
api: api.foodGetDishClassifyList

// CRUD 接口
api.foodAddDishClassify      // 新增
api.foodUpdateDishClassify   // 更新
api.foodDeleteDishClassify   // 删除
api.foodChangeDishClassifyStatus // 状态切换
```

### 示例 3：模糊描述

**用户描述**："需要一个列表页面展示数据"

**查找过程**：
1. 描述模糊，需要更多信息
2. 列出所有模块的列表接口供选择
3. 询问用户具体业务场景

**询问话术**：
```
我找到了以下可用的列表接口：

用户模块：
- userGetStaffList (员工列表)
- userGetRoleList (角色列表)
- userGetHuiyuanClientList (会员列表)

菜品模块：
- foodGetDishList (菜品列表)
- foodGetDishClassifyList (菜品分类)
- foodGetDishComboList (套餐列表)

请告诉我您需要管理的是什么数据？
```

## 接口文件检查

遍历 hooks 目录时，检查：

1. **文件命名语义化程度**
   - good: `useFoodGetDishList.ts` - 语义清晰
   - good: `useUserGetStaffList.ts` - 语义清晰

2. **API 类型签名**
   ```ts
   // 查看接口参数和返回值类型
   import type { ... } from '~/api/generated'

   // 列表接口通常返回
   interface XxxListResponse {
     data: {
       list: Xxx[]
       total: number
     }
   }
   ```

3. **接口可用性**
   - 检查是否需要额外参数
   - 确认分页参数格式

## 相关文档

- [需求分析](requirement-analysis.md)
- [配置生成](config-generation.md)
