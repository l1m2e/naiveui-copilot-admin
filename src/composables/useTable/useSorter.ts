import type { DataTableColumns, DataTableSortState } from 'naive-ui'

/** 排序状态管理器 */
export function useSorter<T>({ columns }: { columns?: DataTableColumns<T> }) {
  // 排序状态
  const sortState = ref<DataTableSortState | DataTableSortState[] | null>(extractInitialSortState(columns),)

  // 转换为 API 参数
  const sortParams = computed(() => convertSortStateToParams(sortState.value))

  // 创建排序变化处理器
  function createSorterHandler(options: {
    pagination?: boolean
    paginationConfig?: Ref<any>
    onRefresh: () => void
  }) {
    return async (sorter: DataTableSortState | DataTableSortState[] | null) => {
      sortState.value = sorter

      // 分页模式下重置到第一页
      if (options.pagination && options.paginationConfig?.value) {
        options.paginationConfig.value.page = 1
        await nextTick()
      }

      options.onRefresh()
    }
  }

  return {
    sortState,
    sortParams,
    createSorterHandler,
  }
}

/** 从列配置中提取初始排序状态 */
export function extractInitialSortState<T>(columns?: DataTableColumns<T>,): DataTableSortState | DataTableSortState[] | null {
  if (!columns) return null

  const sortColumns = columns.filter((col: any) => col.defaultSortOrder)
  if (sortColumns.length === 0)
    return null

  const toSortState = (col: any): DataTableSortState => ({
    columnKey: col.key as string,
    order: col.defaultSortOrder,
    sorter: true,
  })

  return sortColumns.length === 1
    ? toSortState(sortColumns[0])
    : sortColumns.map(toSortState)
}

/** 将排序状态转换为后端 API 参数 */
export function convertSortStateToParams(sortState: DataTableSortState | DataTableSortState[] | null,): Record<string, any> {
  if (!sortState) return {}

  const toBackendOrder = (order: any) => order === 'ascend' ? 'asc' : 'desc'

  // 单列排序
  if (!Array.isArray(sortState)) {
    const { columnKey, order } = sortState
    return order
      ? { sortField: columnKey, sortOrder: toBackendOrder(order) }
      : {}
  }

  // 多列排序
  const sortFields = sortState
    .filter(s => s.order)
    .map(s => ({
      field: s.columnKey,
      order: toBackendOrder(s.order),
    }))

  return sortFields.length > 0 ? { sorts: sortFields } : {}
}
