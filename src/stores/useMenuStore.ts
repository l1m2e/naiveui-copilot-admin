import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { cloneDeep, sortBy } from 'es-toolkit'
import { defineStore } from 'pinia'
import { hasPermi } from '~/utils'

export interface AppMenuOption {
  label: string
  key: string
  path: string
  children?: AppMenuOption[]
  meta?: RouteMeta
}

export interface PermissionTreeNode {
  label: string
  key: string
  children?: PermissionTreeNode[]
}

export interface SimpleNode {
  label: string
  key: string
  children?: SimpleNode[]
  meta?: RouteMeta
}

export const useMenuStore = defineStore('menu', () => {
  const menuTree = ref<AppMenuOption[]>([])
  const flatMenuOptions = ref<AppMenuOption[]>([])
  const allFlatRouteTreeOptions = ref<AppMenuOption[]>([])
  const permissionTree = ref<PermissionTreeNode[]>([])

  function buildMenuFromRoutes(routes: readonly RouteRecordRaw[]) {
    // 构建包含所有节点的扁平数据（用于权限树）
    allFlatRouteTreeOptions.value = buildAllFlatOptions(routes)
    // 构建过滤后的扁平菜单数据
    flatMenuOptions.value = buildFlatMenuOptions(routes)
    // 从过滤后的数据构建菜单树
    menuTree.value = buildMenuTree(flatMenuOptions.value)
    // 从完整的扁平数据构建权限树，避免 hideInMenu 过滤掉权限
    const allMenuTree = buildMenuTree(allFlatRouteTreeOptions.value)
    permissionTree.value = buildPermissionTree(allMenuTree)
  }

  return {
    menuTree,
    flatMenuOptions,
    permissionTree,
    allFlatRouteTreeOptions,
    buildMenuFromRoutes,
  }
})

/** 从路由构建扁平菜单 */
function buildFlatMenuOptions(
  routes: readonly RouteRecordRaw[],
  parentPath = '',
  includeHidden = false
): AppMenuOption[] {
  return routes.flatMap((route) => {
    const currentPath = resolvePath(parentPath, route.path)
    const { meta, children: routeChildren } = route
    const { title } = meta ?? {}

    const children = routeChildren
      ? buildFlatMenuOptions(routeChildren, currentPath, includeHidden)
      : []

    const isNotMenu = meta?.isMenu === false
    const isHiddenInMenu = meta?.hideInMenu === true

    // 如果是 isMenu === false，总是过滤掉
    if (!title || isNotMenu) return children

    // 如果不包含隐藏项且标记为隐藏，则过滤
    if (!includeHidden && isHiddenInMenu) return children

    return [
      {
        label: String(title),
        key: String(route.name ?? currentPath),
        path: currentPath,
        meta,
      },
      ...children,
    ]
  })
}

/** 从路由构建所有扁平菜单（包括隐藏的，用于权限树） */
function buildAllFlatOptions(
  routes: readonly RouteRecordRaw[],
  parentPath = ''
): AppMenuOption[] {
  return buildFlatMenuOptions(routes, parentPath, true)
}

/** 扁平列表构建树形结构 */
function buildMenuTree(flatOptions: AppMenuOption[]): AppMenuOption[] {
  const optionMap = new Map<string, AppMenuOption>()
  const optionKeyMap = new Map<string, AppMenuOption>()
  const roots: AppMenuOption[] = []

  // 权限过滤：只保留有权限的菜单项
  const filteredOptions = flatOptions.filter(opt => opt.key ? hasPermi(opt.key) : true)
  filteredOptions.forEach((opt) => {
    const node = { ...opt, children: undefined }
    optionMap.set(opt.path, node)
    optionKeyMap.set(opt.key, node)
  })

  filteredOptions.forEach((option) => {
    const segments = option.path.split('/').filter(Boolean)
    const node = optionMap.get(option.path)!

    let foundParent = false
    // 向上查找最近的父级节点
    for (let i = segments.length - 1; i > 0; i--) {
      const parentPath = `/${segments.slice(0, i).join('/')}`
      const parent = optionMap.get(parentPath)

      if (parent) {
        parent.children ||= []
        parent.children.push(node)
        foundParent = true
        break
      }
    }

    const activeMenuParent = typeof option.meta?.activeMenu === 'string'
      ? optionKeyMap.get(option.meta.activeMenu)
      : undefined

    if (!foundParent && activeMenuParent && activeMenuParent !== node) {
      activeMenuParent.children ||= []
      activeMenuParent.children.push(node)
      foundParent = true
    }

    if (!foundParent) {
      roots.push(node)
    }
  })

  // 根据 meta.order 递归排序函数
  function sortByOrder(nodes: AppMenuOption[]): AppMenuOption[] {
    return sortBy(nodes, [(node: AppMenuOption) => node.meta?.order ?? Number.MAX_SAFE_INTEGER])
      .map((node) => {
        if (node.children?.length) {
          node.children = sortByOrder(node.children)
        }
        return node
      })
  }

  return sortByOrder(roots)
}

/** 构建权限树：处理菜单 + permissions */
function buildPermissionTree(menus: SimpleNode[]): PermissionTreeNode[] {
  if (!Array.isArray(menus)) return []

  return menus.map((menu) => {
    const newMenu: SimpleNode = cloneDeep(menu)

    // 递归处理 children
    if (newMenu.children?.length) {
      newMenu.children = buildPermissionTree(newMenu.children)
    }

    const permissions = newMenu.meta?.permissions
    if (Array.isArray(permissions) && permissions.length > 0) {
      newMenu.children ||= []

      const sortedPermissions = sortBy(permissions, [p => p.order ?? Number.MAX_SAFE_INTEGER])

      sortedPermissions.forEach((p) => {
        newMenu.children!.push({
          label: p.label,
          key: p.value,
        })
      })

      // 清理权限字段
      delete newMenu.meta?.permissions
    }

    return newMenu
  })
}

/** 解析完整路径 */
function resolvePath(parentPath: string, currentPath: string): string {
  if (!currentPath) return parentPath || '/'
  if (currentPath.startsWith('/')) return currentPath

  const base = parentPath === '/' ? '' : parentPath
  const fullPath = `${base}/${currentPath}`.replace(/\/+/g, '/')

  return fullPath === '/' ? fullPath : fullPath.replace(/\/$/, '')
}

/**
 * 检测重复的权限 key
 * @param routes 路由配置数组
 * @returns 返回重复的权限 key 数组
 */
export function findDuplicatePermissionKeys(routes: readonly RouteRecordRaw[]): string[] {
  const keyCountMap = new Map<string, number>()

  // 递归收集所有权限 key
  function collectPermissionKeys(routes: readonly RouteRecordRaw[]) {
    routes.forEach((route) => {
      const permissions = route.meta?.permissions
      if (Array.isArray(permissions)) {
        permissions.forEach((p) => {
          if (p.value) {
            keyCountMap.set(p.value, (keyCountMap.get(p.value) ?? 0) + 1)
          }
        })
      }

      // 递归处理子路由
      if (route.children?.length) {
        collectPermissionKeys(route.children)
      }
    })
  }

  collectPermissionKeys(routes)

  // 筛选出现次数大于 1 的 key
  return Array.from(keyCountMap.entries()).filter(([, count]) => count > 1).map(([key]) => key)
}
