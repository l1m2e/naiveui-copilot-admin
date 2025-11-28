import type { DataTableColumns } from './index'
import { useLocalStorage } from '@vueuse/core'

type StoredColumn = {
  key: string | number
  visible: boolean
  fixed?: 'left' | 'right'
}

/**
 * 列配置存储管理
 * @param storageKey - localStorage 存储键，不传则不启用持久化
 */
export function useColumnStorage<T>(storageKey?: string) {
  // 只有提供 storageKey 时才启用 localStorage 持久化
  const storedColumns = storageKey
    ? useLocalStorage<StoredColumn[]>(storageKey, [])
    : ref<StoredColumn[]>([])

  /**
   * 合并初始列配置和存储的配置
   * @param initialColumns 初始列配置
   * @returns 合并后的列配置
   */
  function merge(initialColumns: DataTableColumns<T>): DataTableColumns<T> {
    if (!storedColumns.value.length) return initialColumns

    const initialMap = new Map(initialColumns.map(col => [col.key, col]))
    const result: DataTableColumns<T> = []

    // 按存储顺序添加列
    storedColumns.value.forEach(({ key, visible, fixed }) => {
      const initial = initialMap.get(key)
      if (initial) {
        result.push({ ...initial, visible, fixed })
        initialMap.delete(key)
      }
    })

    // 添加新列（初始配置有但存储中没有的）
    result.push(...initialMap.values())

    return result
  }

  /**
   * 保存列配置
   * @param columns 要保存的列配置
   */
  function save(columns: DataTableColumns<T>) {
    storedColumns.value = columns.map(col => ({
      key: col.key,
      visible: col.visible ?? true,
      fixed: col.fixed,
    }))
  }

  /**
   * 清除存储的配置
   */
  function clear() {
    storedColumns.value = []
  }

  return {
    merge,
    save,
    clear,
  }
}
