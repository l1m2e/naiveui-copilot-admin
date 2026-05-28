import type { ComputedRef } from 'vue'
import type {
  ApiFunction,
  ApiParams,
  ApiRest,
  FetchArgs,
} from '../_shared/api-types'
import { get } from 'es-toolkit/compat'

interface DataFetcherOptions<T extends ApiFunction> {
  /** 请求接口 */
  api: T
  /** 请求参数 */
  params: ComputedRef<Record<string, any>>
  /** 是否启用分页 */
  pagination?: boolean
  /** 数据字段名 */
  dataField: string
  /** 总数字段名 */
  totalField: string
  /** 是否立即执行 */
  immediate: boolean
}

/** 统一的数据获取器，根据是否分页选择对应实现，并绑定缓存页激活刷新。 */
export function useTableDataFetcher<T extends ApiFunction>(
  { api, params, pagination = false, dataField, totalField, immediate }: DataFetcherOptions<T>,
) {
  const fetcher = pagination
    ? usePaginationList<T>({ api, params, dataField, totalField, immediate })
    : useNormalList({ api, params, dataField, immediate })

  useActivatedRefresh(() => fetcher.getList())

  return fetcher
}

type NormalDataFetcherOptions<T extends ApiFunction> = Pick<
  DataFetcherOptions<T>,
  'api' | 'params' | 'dataField' | 'immediate'
>

/** 非分页列表数据获取器，负责合并查询参数并提取列表字段。 */
function useNormalList<T extends ApiFunction>(
  { api, params, dataField, immediate }: NormalDataFetcherOptions<T>,
) {
  const { state, execute, isLoading } = useAsyncState(
    async (...args: FetchArgs<T>) => {
      if (api.length === 0) {
        const response = await (api as unknown as () => ReturnType<T>)()
        return get(response, dataField)
      }

      const [fastParams, ...restArgs] = args
      const mergedParams = { ...params.value, ...(fastParams ?? {}) } as unknown as ApiParams<T>
      const response = await api(mergedParams, ...(restArgs as ApiRest<T>))
      return get(response, dataField)
    },
    [],
    { shallow: false, immediate }
  )

  /** 手动刷新列表，支持传入临时查询参数覆盖默认参数。 */
  function getList(): ReturnType<typeof execute>
  function getList(values: any): ReturnType<typeof execute>
  function getList(...args: FetchArgs<T>): ReturnType<typeof execute>
  function getList(...args: any[]) {
    return execute(0, ...(args as FetchArgs<T>))
  }

  return {
    list: state,
    getList,
    isLoading,
    paginationConfig: undefined,
  }
}

/** KeepAlive 页面重新激活时刷新数据，并跳过首次激活避免重复请求。 */
function useActivatedRefresh(refresh: () => unknown) {
  let activated = false

  onActivated(() => {
    if (!activated) {
      activated = true
      return
    }

    refresh()
  })
}
