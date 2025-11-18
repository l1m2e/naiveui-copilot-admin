/// <reference types="vite/client" />

import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 图标类名（如：'i-carbon-home'） */
    icon?: string
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean
    /** 是否在菜单中显示 默认 true 显示，不需要显示时设置为 false */
    isMenu?: boolean
    /** 是否缓存页面组件 默认 true 缓存，不需要缓存时设置为 false */
    keepAlive?: boolean
    /** 权限列表 */
    permissions?: { label: string, value: string, order?: number }[]
    /** 排序 */
    order?: number
  }
}
