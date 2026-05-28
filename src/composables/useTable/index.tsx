import type { DataTableBaseColumn, DataTableInst, DataTableSelectionColumn } from 'naive-ui'

import type { Get } from 'type-fest'
import type { ApiFunction, ApiParams } from '../_shared/api-types'
import type { FormItemProps } from '~/components/form-item'
import type { ColumnSettingsKey } from '~/constants'
import { cloneDeep } from 'es-toolkit'
import { set } from 'es-toolkit/compat'
import { dataTableProps, NDataTable } from 'naive-ui'
import Form from '~/components/query-form/index.vue'
import { FORM_ITEM_COMPONENT_MAP } from '~/constants'

import { useColumns } from './useColumns'
import { useFilter } from './useFilter'
import { useSorter } from './useSorter'
import { useTableDataFetcher } from './useTableDataFetcher'

/** 表格列配置 */
export type DataTableColumns<T> = Array<DataTableBaseColumn<T> | DataTableSelectionColumn<T> & {
  visible?: boolean
}>

/** 提取 API 函数的第一个参数类型（无入参时兜底为 Record） */
type ExtractApiParams<T extends ApiFunction> = ApiParams<T> extends never ? Record<string, any> : ApiParams<T>

/**
 * 从 API 函数中提取表格数据项类型
 * 使用 type-fest 的 Get 工具类型通过路径提取嵌套字段
 * 路径格式: 'data.list[0]' 表示提取 API 返回的 data.list 数组的第一项类型
 */
type ExtractTableData<
  TApi extends ApiFunction,
  TField extends string
> = NonNullable<Get<Awaited<ReturnType<TApi>>, TField>>[number]

function getQueryFormDefaultValues(items?: FormItemProps[]) {
  const defaultValues: Record<string, unknown> = {}

  items?.forEach((item) => {
    if (!item.field) return

    const componentDefaultValue = typeof item.component === 'string'
      ? FORM_ITEM_COMPONENT_MAP[item.component as keyof typeof FORM_ITEM_COMPONENT_MAP]?.defaultValue
      : undefined

    const defaultValue = item.value ?? componentDefaultValue

    if (defaultValue !== undefined) {
      set(defaultValues, item.field, cloneDeep(defaultValue))
    }
  })

  return defaultValues
}

export interface UseTableOptions<
  TApi extends ApiFunction = ApiFunction,
  TField extends string = 'data.list',
> {
  /** 请求方法 */
  api: TApi
  /** 查询表单配置 */
  queryFormSchema?: FormItemProps[] | MaybeRef<FormItemProps[]> | ComputedRef<FormItemProps[]>
  /** 表格列配置 */
  columns?: DataTableColumns<ExtractTableData<TApi, TField>>
  /** 是否启用分页 */
  pagination?: boolean
  /** 是否启用列配置（拖拽排序、显示/隐藏）如果使用 ColumnSettingsKey 代表会持久化非一次性 */
  columnSettings?: boolean | ColumnSettingsKey
  /** 数据字段名 默认为 'data' */
  dataField?: TField
  /** 总数字段名 默认为 'total' */
  totalField?: string
  /** 是否立即执行 */
  immediate?: boolean
}

export function useTable<
  TApi extends ApiFunction = ApiFunction,
  TField extends string = 'data.list',
  TForm = ExtractApiParams<TApi>
>({
  api,
  queryFormSchema,
  columns,
  pagination = false,
  columnSettings = false,
  dataField = 'data.list' as TField,
  totalField = 'data.total',
  immediate = true,
}: UseTableOptions<TApi, TField>) {
  const tableContext = ref<DataTableInst>()
  const formContext = ref<{ form: TForm, formRef: UseFormInst }>()
  const queryFormDefaultValues = computed(() => getQueryFormDefaultValues(toValue(queryFormSchema)) as TForm)

  // 列数据排序
  const { sortState, sortParams, createSorterHandler } = useSorter({ columns })

  // 列数据筛选
  const { filterState, filterParams, createFilterHandler } = useFilter({ columns })

  // 数据获取器
  const { list, getList, isLoading, paginationConfig } = useTableDataFetcher({
    api,
    params: computed(() => ({
      ...queryFormDefaultValues.value,
      ...formContext.value?.form,
      ...sortParams.value,
      ...filterParams.value,
    })),
    pagination,
    dataField,
    totalField,
    immediate,
  })

  const onUpdateSorter = createSorterHandler({ onRefresh: getList, paginationConfig, pagination })
  const onUpdateFilters = createFilterHandler({ onRefresh: getList, paginationConfig, pagination })

  // 列处理
  const { columns: processedColumns } = useColumns({ columns, columnSettings })

  const QueryForm = defineComponent({
    name: 'TableQueryForm',
    setup: () => () => (
      <Form
        items={toValue(queryFormSchema)}
        search={getList}
        reset={getList}
        ref={formContext}
      />
    ),
  })

  const Table = defineComponent({
    name: 'DataTable',
    props: dataTableProps,
    setup: props => () => (
      <NDataTable
        ref={tableContext}
        {...props}
        columns={processedColumns.value}
        data={list.value}
        loading={isLoading.value}
        pagination={paginationConfig?.value || false}
        remote
        allow-sorter-multiple
        onUpdateSorter={onUpdateSorter}
        onUpdateFilters={onUpdateFilters}
        bordered
        scroll-x="fit-content"
      />
    ),
  })

  return {
    QueryForm,
    Table,
    tableContext,
    formContext,
    paginationConfig,
    isLoading,
    getList,
    list: list as Ref<Get<Awaited<ReturnType<TApi>>, TField>>,
    sortState,
    filterState,
  }
}
