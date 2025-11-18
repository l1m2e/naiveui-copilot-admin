# 表格页面生成器

目标：根据用户提供的接口、图片或描述自动生成 Vue 表格页面，包括查询表单和表格列配置。

---

## 1. 接口分析

1. 用户会提供列表查询接口，例如：`src/api/servers/trickle.ts`。
2. 需要主动查找该文件，理解接口的入参和出参类型。
3. 记住接口入参定义（用于生成查询表单 screeningSchema）。
4. 记住接口出参定义（用于生成表格 columns）。

---

## 2. 组合式函数和组件读取

1. 读取 `src/composables/useTable.ts`，理解其入参和出参。
2. 读取 `src/components/Yst/Table/index.ts`，了解表格组件可用 API。
3. 读取 `src/components/Yst/FormItem/index.ts`，了解查询表单构成方式。
4. 读取 `src/components/Yst/FormV2/componentsMap.ts`，了解查询表单 `component` 支持的类型。

---

## 3. 查询表单生成规则

1. 根据接口入参生成 `screeningSchema`：
   - 支持 `label`、`field`、`component`、`props`、`fields` 等属性。
   - 根据字段类型选择组件，例如：
     - 文本 → `el-input`
     - 下拉 → `yst-select`
     - 日期范围 → `yst-date-picker-range-format`
     - 布尔值 → `el-checkbox`
   - 更多请参考 `src/components/Yst/FormV2/componentsMap.ts`

---

## 4. 表格列生成规则

1. 根据接口出参生成 `columns`：
   - 支持 `label`、`prop`、`width`、`render`、`fixed` 等属性。
   - `render` 函数 支持返回 任意 `tsx` 例如：`render: ({ row }) => <div>{row.status}</div>`
   - 一般来说 构建 `columns` 只需要 `label` 和 `prop` 属性组成的对象数组即可 每个对象代表一列 表格组件会自动渲染 对应 `prop`  的数据到页面上
   - 对枚举类型字段生成可视化映射，例如 `0` → 入库，`1` → 出库。 
   - 对时间字段自动格式化（如果格式是时间戳的话），例如 `F.formatTimestamp(row.xxx, 'YY/MM/DD HH:mm:ss')`。
   - 除了上述类型以外 不要主动使用  render 函数的方式渲染 尽量只指定 prop 就好 

---

## 5. 示例参考

```vue
<script lang="tsx" setup>
import type { StatisticWarehousingOutboundDetailRecordPageVo } from '~/api/servers/trickle'

const { key } = useTable<StatisticWarehousingOutboundDetailRecordPageVo>({
  useBuiltKey: false,
  screeningSchema: [
    { label: '仓库', field: 'warehouseId', component: 'yst-select' },
    { label: '时间', fields: ['statisticTimeStart', 'statisticTimeEnd'], component: 'yst-date-picker-range-format' },
    { label: '单号', field: 'businessNo', component: 'el-input' }
  ],
  columns: [
    { label: '出/入库', prop: 'statisticType', render: ({ row }) => row.statisticType === '0' ? '入库' : '出库', width: 100 },
    { label: '仓库', prop: 'warehouseName', width: 100 },
    { label: '时间', prop: 'statisticTime', render: ({ row }) => F.formatTimestamp(row.statisticTime, 'YY/MM/DD HH:mm:ss'), width: 150 }
  ]
})
</script>

<template>
  <div>
    <YstTableScreening :table-key="key" />
    <el-card shadow="never" class="mt-15px">
      <YstTable :request-api="api.trickle.warehousingOutboundDetailRecord.pageList" :table-key="key" />
    </el-card>
  </div>
</template>
```