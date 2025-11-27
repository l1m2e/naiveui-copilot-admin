import type { DataTableBaseColumn, DataTableInst } from 'naive-ui'
import type { FormItemProps } from '~/components/form-item'
import type { ColumnSettingsKey } from '~/constants'
import { dataTableProps, NDataTable } from 'naive-ui'
import Form from '~/components/query-form/query-form.vue'

import { useColumns } from './useColumns'
import { useFilter } from './useFilter'
import { useSorter } from './useSorter'
import { useTableDataFetcher } from './useTableDataFetcher'

export type DataTableColumns<T> = Array<DataTableBaseColumn<T> & {
  visible?: boolean
}>

export interface UseTableOptions<T = any> {
  /** 请求方法 */
  api: (...args: any[]) => any
  /** 查询表单配置 */
  queryFormSchema?: FormItemProps[]
  /** 表格列配置 */
  columns?: DataTableColumns<T>
  /** 是否启用分页 */
  pagination?: boolean
  /** 是否启用列配置（拖拽排序、显示/隐藏）如果使用 ColumnSettingsKey 代表会持久化非一次性 */
  columnSettings?: boolean | ColumnSettingsKey
  /** 数据字段名 默认为 'rows' */
  dataField?: string
  /** 总数字段名 默认为 'total' */
  totalField?: string
}

export function useTable<T = any, U = any>({
  api,
  queryFormSchema,
  columns,
  pagination = false,
  columnSettings = false,
  dataField = 'rows',
  totalField = 'total',
}: UseTableOptions<T>) {
  const tableContext = ref<DataTableInst>()
  const formContext = ref<{ form: U, formRef: UseFormInst }>()

  // 列数据排序
  const { sortState, sortParams, createSorterHandler } = useSorter({ columns })

  // 列数据筛选
  const { filterState, filterParams, createFilterHandler } = useFilter({ columns })

  // 数据获取器
  const { list, getList, isLoading, paginationConfig } = useTableDataFetcher({
    api,
    params: computed(() => ({
      ...formContext.value?.form,
      ...sortParams.value,
      ...filterParams.value,
    })),
    pagination,
    dataField,
    totalField,
  })

  const onUpdateSorter = createSorterHandler({ onRefresh: getList, paginationConfig, pagination })
  const onUpdateFilters = createFilterHandler({ onRefresh: getList, paginationConfig, pagination })

  // 列处理
  const { columns: processedColumns } = useColumns({ columns, columnSettings })

  const QueryForm = defineComponent({
    name: 'TableQueryForm',
    setup: () => () => (
      <Form
        items={queryFormSchema}
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
        scroll-x="max-content"
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
    list,
    sortState,
    filterState,
  }
}
