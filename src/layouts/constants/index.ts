export interface LayoutProvide {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 侧边栏宽度 */
  sidebarWidth: number
  /** 侧边栏图标大小 */
  sidebarIconSize: number
  /** 侧边栏折叠宽度 */
  sidebarCollapsedWidth: number
}

const LAYOUTPROVIDE_KEY = Symbol('LAYOUTPROVIDE_KEY') as InjectionKey<Ref<LayoutProvide>>

export { LAYOUTPROVIDE_KEY }
