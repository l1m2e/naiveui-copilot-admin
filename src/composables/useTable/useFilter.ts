import type { DataTableColumns, DataTableFilterState } from 'naive-ui'

/** 筛选状态管理器 */
export function useFilter<T>({ columns }: { columns?: DataTableColumns<T> }) {
  // 筛选状态
  const filterState = ref<DataTableFilterState | null>(extractInitialFilterState(columns))

  // 转换为 API 参数
  const filterParams = computed(() => convertFilterStateToParams(filterState.value))

  // 创建筛选变化处理器
  function createFilterHandler(options: {
    pagination?: boolean
    paginationConfig?: Ref<any>
    onRefresh: () => void
  }) {
    return async (filters: DataTableFilterState) => {
      filterState.value = filters

      // 分页模式下重置到第一页
      if (options.pagination && options.paginationConfig?.value) {
        options.paginationConfig.value.page = 1
        await nextTick()
      }

      options.onRefresh()
    }
  }

  return {
    filterState,
    filterParams,
    createFilterHandler,
  }
}

/** 从列配置中提取初始筛选状态 */
export function extractInitialFilterState<T>(columns?: DataTableColumns<T>,): DataTableFilterState | null {
  if (!columns) return null

  const filterState: DataTableFilterState = {}
  let hasFilter = false

  columns.forEach((col: any) => {
    if (col.filterOptions && col.key) {
      filterState[col.key] = col.defaultFilterOptionValues || []
      hasFilter = true
    }
  })

  return hasFilter ? filterState : null
}

/** 将筛选状态转换为后端 API 参数 */
export function convertFilterStateToParams(filterState: DataTableFilterState | null,): Record<string, any> {
  if (!filterState) return {}

  const filters: Record<string, any> = {}

  Object.entries(filterState).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      filters[key] = values
    }
    else if (values != null && !Array.isArray(values)) {
      filters[key] = values
    }
  })

  return Object.keys(filters).length > 0 ? { filters } : {}
}
