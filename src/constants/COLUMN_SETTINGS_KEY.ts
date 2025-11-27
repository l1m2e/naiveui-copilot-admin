/**
 * 表格列配置存储 Key 常量
 * 用于 localStorage 存储各个页面的表格列配置
 */
export const COLUMN_SETTINGS_KEY = {

} as const

export type ColumnSettingsKey = (typeof COLUMN_SETTINGS_KEY)[keyof typeof COLUMN_SETTINGS_KEY]
