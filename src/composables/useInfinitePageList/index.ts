import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Ref } from 'vue'
import { useScroll } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import { useLoading } from '~/composables/useLoading'

interface PaginationConfig {
  total: number
  pageNum: number
  pageSize: number
}

/**
 * `useInfinitePageList` 配置项
 */
interface UseInfinitePageListOptions<T, P extends Record<string, unknown>> {
  /** 滚动容器，滚动到底部时会自动触发下一页加载 */
  el: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>
  /**
   * 分页请求函数
   * - 会自动注入 `page`、`page_size`
   * - 第二个参数为 `AbortSignal`，请求库需要透传它以支持取消请求
   */
  requestApi: (params: P & { page: number, page_size: number }, signal: AbortSignal) => Promise<{
    list: T[]
    total: number
    current?: number
  }>
  /** 额外查询参数，支持 `ref`、`computed` 或 getter */
  params?: MaybeRefOrGetter<P>
  /** 是否在初始化时立即请求第一页 */
  immediate?: boolean
  /** 分页初始配置，通常只需要自定义 `pageSize` */
  paginationConfig?: Partial<PaginationConfig>
  /** 列表格式化函数，可用于补字段或转换后端数据结构 */
  formatData?: (list: T[]) => T[]
  /** 每次请求成功并写入列表后触发 */
  onFinished?: () => void
}

/**
 * 通用无限滚动分页列表。
 *
 * 适用场景：
 * - 下拉面板中的滚动列表
 * - 抽屉 / 弹窗内的分页列表
 * - 任意“滚动到底自动加载下一页”的局部容器
 *
 * 内置能力：
 * - 自动监听滚动容器到底部并加载下一页
 * - 新请求发起前自动取消上一次请求
 * - 只接受最后一次请求结果，避免旧请求覆盖新数据
 * - 支持外部通过 `reload()` 或 `getList(true)` 重置并重拉数据
 *
 * @example
 * ```ts
 * const viewportRef = ref<HTMLElement | null>(null)
 * const keyword = ref('')
 *
 * const {
 *   list,
 *   isLoading,
 *   isLastPage,
 *   reload,
 * } = useInfinitePageList<
 *   { id: number, name: string },
 *   { name?: string, is_active: boolean }
 * >({
 *   el: viewportRef,
 *   immediate: true,
 *   params: computed(() => ({
 *     name: keyword.value.trim() || undefined,
 *     is_active: true,
 *   })),
 *   requestApi: async (params, signal) => {
 *     const { data } = await api.materialGetFoodMaterialList(params, { signal })
 *     return {
 *       list: data.list,
 *       total: data.total,
 *       current: params.page,
 *     }
 *   },
 * })
 *
 * watch(keyword, () => reload())
 * ```
 *
 * @example
 * ```ts
 * // 手动控制重置拉取时，也可以直接调用 getList(true)
 * const { getList } = useInfinitePageList(...)
 *
 * await getList(true)
 * ```
 */
export function useInfinitePageList<T, P extends Record<string, unknown>>({
  el,
  requestApi,
  params,
  immediate = false,
  formatData,
  paginationConfig: optionsPaginationConfig,
  onFinished,
}: UseInfinitePageListOptions<T, P>) {
  const list = ref<T[]>([]) as Ref<T[]>
  const { total = 0, pageNum = 1, pageSize = 15 } = optionsPaginationConfig || {}
  const paginationConfig = reactive<PaginationConfig>({ total, pageNum, pageSize })
  const isLastPage = computed(() => Math.ceil(paginationConfig.total / paginationConfig.pageSize) <= paginationConfig.pageNum)

  let abortController: AbortController | null = null
  let requestId = 0

  const [isLoading, getList] = useLoading(async (reset = false) => {
    // 取消旧请求，并只让最后一次请求有资格写入结果，避免竞态覆盖。
    abortController?.abort()
    abortController = new AbortController()
    const currentRequestId = ++requestId

    if (reset) {
      list.value = []
      paginationConfig.total = 0
      paginationConfig.pageNum = 1
    }

    const response = await requestApi({
      ...(toValue(params) || {} as P),
      page: paginationConfig.pageNum,
      page_size: paginationConfig.pageSize,
    }, abortController.signal)

    if (currentRequestId !== requestId) {
      return
    }

    const nextList = formatData ? formatData(response.list) : response.list
    list.value = list.value.concat(nextList)
    paginationConfig.total = response.total
    paginationConfig.pageNum = response.current ?? paginationConfig.pageNum
    onFinished?.()
  })

  /** 重置列表并重新请求第一页。适合筛选条件变化后直接调用。 */
  function reload() {
    void getList(true)
  }

  function onLoadMore() {
    if (!isLastPage.value && !isLoading.value) {
      paginationConfig.pageNum += 1
      void getList()
    }
  }

  const { arrivedState } = useScroll(el, {
    onScroll() {
      if (arrivedState.bottom) {
        onLoadMore()
      }
    },
  })

  if (immediate) {
    void getList()
  }

  return {
    list,
    paginationConfig,
    isLoading,
    getList,
    isLastPage,
    reload,
  }
}
