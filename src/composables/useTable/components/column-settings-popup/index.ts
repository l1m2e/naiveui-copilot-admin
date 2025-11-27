import type { DataTableColumns } from '../../index'

export interface ColumnSettingsPopupProps<T> {
  columns: DataTableColumns<T>
}

export interface ColumnSettingsPopupEmits<T> {
  (e: 'confirm', columns: DataTableColumns<T>): void
}
