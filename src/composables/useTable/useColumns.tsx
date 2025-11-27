import type { DataTableColumns } from './index'
import type { ColumnSettingsKey } from '~/constants'
import { cloneDeep } from 'es-toolkit'
import ColumnSettingsPopup from './components/column-settings-popup/index.vue'

export interface UseColumnsOptions<T> {
  columns?: DataTableColumns<T>
  columnSettings?: boolean | ColumnSettingsKey
}

export function useColumns<T>({ columns: initialColumns = [], columnSettings }: UseColumnsOptions<T> = {}) {
  const settingColumns: DataTableColumns<T> = initialColumns
    .map(col => ({
      ...col,
      visible: true,
    }))

  // 存储纯数据配置（不含渲染函数）
  const columns = ref<DataTableColumns<T>>(cloneDeep(settingColumns))

  // 确认列设置
  function handleConfirmColumns(newColumns: DataTableColumns<T>) {
    columns.value = cloneDeep(newColumns)
  }

  // 动态生成显示列（在最后一个可见列添加设置按钮）
  const displayColumns = computed(() => {
    const visibleCols = columns.value.filter(col => col.visible)
    const lastVisibleKey = visibleCols[visibleCols.length - 1]?.key

    return columns.value
      .filter(col => col.visible)
      .map((col) => {
        const { title } = settingColumns.find(settingCol => settingCol.key === col.key) || {}

        if (col.key === lastVisibleKey) {
          return {
            ...col,
            title: () => (
              <div class="flex items-center justify-between">
                <span>{title}</span>
                <ColumnSettingsPopup columns={columns.value} onConfirm={handleConfirmColumns} />
              </div>
            )
          }
        }
        else {
          return {
            ...col,
            title
          }
        }
      })
  })

  return {
    columns: columnSettings ? displayColumns : columns,
  }
}
