import type { FormItemProps as NFormItemProps } from 'naive-ui'
import type { FromItemComponentType } from '~/constants'

export type FormItemProps = {
  /** 标题内容 */
  label?: ((form: Record<string, any>) => JSX.Element | VNode | string) | VNode | string
  /** 表单项的key */
  field?: string
  /** 表单默认值 */
  value?: any
  /** 表单验证 */
  rule?: Array<Record<string, any>>
  /** 组件或者使用tsx返回一个虚拟dom */
  component?: ((form: Record<string, any>) => JSX.Element) | VNode | FromItemComponentType
  /** 组件属性 事件以 on 开头 */
  props?: Record<string, any> | ((form: Record<string, any>) => Record<string, any>)
  /** 插槽 */
  slots?: Record<string, (form: Record<string, any>) => JSX.Element | string>
  /** 表单 */
  formItemProps?: NFormItemProps & { class?: string | string[] }
}
