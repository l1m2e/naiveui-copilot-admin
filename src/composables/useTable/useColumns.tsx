import type { DataTableColumns } from './index'
import type { ColumnSettingsKey } from '~/constants'
import ColumnSettingsPopup from './components/column-settings-popup/index.vue'
import { useColumnStorage } from './useColumnStorage'

export interface UseColumnsOptions<T> {
  columns?: DataTableColumns<T>
  /**
   * 列设置选项
   * - false: 不启用列设置功能
   * - true: 启用列设置 UI，但不缓存（临时配置）
   * - ColumnSettingsKey: 启用列设置 UI 并持久化缓存到 localStorage
   */
  columnSettings?: boolean | ColumnSettingsKey
}

export function useColumns<T>({ columns: initialColumns = [], columnSettings }: UseColumnsOptions<T> = {}) {
  // 确保所有列都有 visible 属性
  const normalizedColumns = initialColumns.map(col => ({ ...col, visible: col.visible ?? true }))

  const storageKey = typeof columnSettings === 'string' ? columnSettings : undefined
  const storage = useColumnStorage<T>(storageKey)

  // 初始化列（合并存储的配置）
  const columns = ref<DataTableColumns<T>>(storage.merge(normalizedColumns))

  // 确认列设置
  function handleConfirmColumns(newColumns: DataTableColumns<T>) {
    columns.value = newColumns
    storage.save(newColumns)
  }

  // 重置列设置
  function handleResetColumns() {
    columns.value = normalizedColumns
    storage.clear()
  }

  // 动态生成显示列（在最后一个可见列添加设置按钮）
  const displayColumns = computed(() => {
    const visibleCols = columns.value.filter(col => col.visible)
    if (!visibleCols.length) return []

    const lastVisibleKey = visibleCols.at(-1)?.key
    const initialMap = new Map(normalizedColumns.map(col => [col.key, col]))

    return visibleCols.map(col => ({
      ...col,
      title: col.key === lastVisibleKey
        ? () => (
            <div class="flex items-center justify-between">
              <span>{initialMap.get(col.key)?.title}</span>
              <ColumnSettingsPopup
                columns={columns.value}
                onConfirm={handleConfirmColumns}
                onReset={handleResetColumns}
              />
            </div>
          )
        : initialMap.get(col.key)?.title,
    }))
  })

  return {
    columns: columnSettings ? displayColumns : columns,
  }
}
