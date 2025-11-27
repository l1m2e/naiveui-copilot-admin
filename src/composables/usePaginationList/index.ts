import type { MaybeRef } from 'vue'

interface UseTablePagination<T extends (...args: any[]) => any> {
  /** 请求方法 */
  api: T
  /** 请求参数 可以是 ref 或者计算 */
  params?: MaybeRef<Parameters<T>> | ComputedRef<Parameters<T>>
  /** 是否立即执行 */
  immediate?: boolean
  /** 数据字段名 默认为 'rows' */
  dataField?: string
  /** 总数字段名 默认为 'total' */
  totalField?: string
}

export function usePaginationList<T extends (...args: any[]) => any>({ api, params, immediate = true, dataField = 'rows', totalField = 'total' }: UseTablePagination<T>) {
  /** 配置分页 */
  const paginationConfig = ref({
    /** 总数 - NaiveUI 使用 itemCount */
    itemCount: 0,
    /** 每页条数 */
    pageSize: 15,
    /** 当前页 - NaiveUI 使用 page */
    page: 1,
    /** 显示快速跳转 */
    showSizePicker: true,
    /** 每页条数选项 */
    pageSizes: [10, 15, 20, 30, 50],
    /** 前缀函数 */
    prefix: (info: any) => `共 ${info.itemCount ?? 0} 条`,
    /** 更新页码的回调 */
    onUpdatePage: (page: number) => {
      paginationConfig.value.page = page
    },
    /** 更新每页条数的回调 */
    onUpdatePageSize: (pageSize: number) => {
      paginationConfig.value.pageSize = pageSize
      paginationConfig.value.page = 1
    }
  })

  type ResponseData = PromiseInnerType<ReturnType<T>>
  type List = ResponseData[keyof ResponseData] extends any[] ? ResponseData[keyof ResponseData] : any[]

  /** 获取数据 */
  const { state: list, execute: getList, isLoading } = useAsyncState<List>(async () => {
    const { page: pageNum, pageSize } = paginationConfig.value
    const response = await api({ ...toValue(params), pageSize, pageNum })
    paginationConfig.value.itemCount = response[totalField]
    return response[dataField]
  }, [] as List, { immediate })

  // 监听分页配置变化如果有变化重新请求数据
  const paginationStop = watch([() => paginationConfig.value.page, () => paginationConfig.value.pageSize], () => {
    getList()
  })

  // 监听传递的参数变化如果有变化 分页重置为第一页
  const paramsStop = watch(
    () => toValue(params),
    () => {
      paginationConfig.value.page = 1
    },
    { deep: true },
  )

  // 组件销毁时停止监听
  onUnmounted(() => {
    paginationStop()
    paramsStop()
  })

  return {
    paginationConfig,
    list,
    getList,
    isLoading
  }
}
