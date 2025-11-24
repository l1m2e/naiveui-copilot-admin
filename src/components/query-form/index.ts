import type { FormItemProps } from '~/components/form-item'

export interface QueryFormProps {
  /** 表单项配置数组 */
  items?: FormItemProps[]
  /**
   * 每行展示的表单项数量
   * 默认 "xl:grid-cols-5 grid-cols-3"
   */
  gridCols?: number | string
  /** 是否默认收起 */
  defaultCollapsed?: boolean
  /** 收起状态下展示的行数 */
  collapsedRows?: number
  /** 查询函数 */
  search?: (values: any) => void | Promise<any>
  /** 重置函数 */
  reset?: () => void | Promise<any>
}
