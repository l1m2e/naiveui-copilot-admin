export type FooterOperationEmits = {
  /** 取消 */
  cancel: []
  /** 保存 */
  confirm: []
}

export type FooterOperationProps = {
  /** 角色权限 */
  hasPermi?: string
  /** 铺满 */
  full?: boolean
  /** 确定按钮的文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 加载中 */
  loading?: boolean
}
