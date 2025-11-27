import type { ComputedRef } from 'vue'

interface DataFetcherOptions {
  /** 请求接口 */
  api: (...args: any[]) => any
  /** 请求参数 */
  params: ComputedRef<any>
  /** 是否启用分页 */
  pagination?: boolean
  /** 数据字段名 默认为 'rows' */
  dataField?: string
  /** 总数字段名 默认为 'total' */
  totalField?: string
}

/** 统一的数据获取器（自动处理分页/非分页） */
export function useTableDataFetcher({ api, params, pagination = false, dataField = 'rows', totalField = 'total' }: DataFetcherOptions) {
  // 分页模式
  if (pagination) {
    return usePaginationList({ api, params, dataField, totalField })
  }

  // 非分页模式
  const { state, execute, isLoading } = useAsyncState(
    async () => {
      const response = await api(params.value)
      return response[dataField]
    },
    [],
  )

  return {
    list: state,
    getList: execute,
    isLoading,
    paginationConfig: undefined,
  }
}
