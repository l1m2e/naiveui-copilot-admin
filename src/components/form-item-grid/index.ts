import type { FormItemProps } from '../form-item'

export type FormItemGrid = Array<FormItemProps & {
  /** v-if  */
  if?: boolean | ((form: any) => boolean) | ComputedRef<boolean>
  /** v-show */
  show?: boolean | ((form: any) => boolean) | ComputedRef<boolean>
}>

export type FormItemGridProps = {
  items: FormItemGrid
}
