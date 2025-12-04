import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import { sortBy } from 'es-toolkit'
import { defineStore } from 'pinia'

export interface AppMenuOption {
  label: string
  key: string
  path: string
  children?: AppMenuOption[]
  mate?: RouteMeta
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
  mate?: RouteMeta
}

export const useMenuStore = defineStore('menu', () => {
  const menuTree = ref<AppMenuOption[]>([])
  const flatMenuOptions = ref<AppMenuOption[]>([])
  const permissionTree = ref<PermissionTreeNode[]>([])

  function buildMenuFromRoutes(routes: readonly RouteRecordRaw[]) {
    // 构建包含所有节点的扁平数据（用于权限树）
    const allFlatOptions = buildAllFlatOptions(routes)
    // 构建过滤后的扁平菜单数据
    flatMenuOptions.value = buildFlatMenuOptions(routes)
    // 从过滤后的数据构建菜单树
    menuTree.value = buildMenuTree(flatMenuOptions.value)
    // 从完整的扁平数据构建权限树，避免 hideInMenu 过滤掉权限
    const allMenuTree = buildMenuTree(allFlatOptions)
    permissionTree.value = buildPermissionTree(allMenuTree)
  }

  return {
    menuTree,
    flatMenuOptions,
    permissionTree,
    buildMenuFromRoutes,
  }
})

/** 从路由构建所有扁平菜单（包括隐藏的，用于权限树） */
function buildAllFlatOptions(
  routes: readonly RouteRecordRaw[],
  parentPath = ''
): AppMenuOption[] {
  return routes.flatMap((route) => {
    const currentPath = resolvePath(parentPath, route.path)
    const { meta, children: routeChildren } = route
    const { title } = meta ?? {}

    const children = routeChildren
      ? buildAllFlatOptions(routeChildren, currentPath)
      : []

    // 只过滤掉非菜单项，保留所有有标题的项（包括 hideInMenu 的）
    const isNotMenu = meta?.isMenu === false

    if (!title || isNotMenu) return children

    return [
      {
        label: String(title),
        key: String(route.name ?? currentPath),
        path: currentPath,
        mate: meta,
      },
      ...children,
    ]
  })
}

/** 从路由构建扁平菜单（过滤掉隐藏的，用于菜单展示） */
function buildFlatMenuOptions(
  routes: readonly RouteRecordRaw[],
  parentPath = ''
): AppMenuOption[] {
  return routes.flatMap((route) => {
    const currentPath = resolvePath(parentPath, route.path)
    const { meta, children: routeChildren } = route
    const { title } = meta ?? {}

    const children = routeChildren
      ? buildFlatMenuOptions(routeChildren, currentPath)
      : []

    const isHidden = meta?.isMenu === false || meta?.hideInMenu === true

    if (!title || isHidden) return children

    return [
      {
        label: String(title),
        key: String(route.name ?? currentPath),
        path: currentPath,
        mate: meta,
      },
      ...children,
    ]
  })
}

/** 扁平列表构建树形结构 */
function buildMenuTree(flatOptions: AppMenuOption[]): AppMenuOption[] {
  const optionMap = new Map<string, AppMenuOption>()
  const roots: AppMenuOption[] = []

  flatOptions.forEach((opt) => {
    optionMap.set(opt.path, { ...opt, children: undefined })
  })

  flatOptions.forEach((option) => {
    const segments = option.path.split('/').filter(Boolean)
    const node = optionMap.get(option.path)!

    if (segments.length <= 1) {
      roots.push(node)
      return
    }

    const parentPath = `/${segments.slice(0, -1).join('/')}`
    const parent = optionMap.get(parentPath)

    if (parent) {
      parent.children ||= []
      parent.children.push(node)
    }
    else {
      roots.push(node)
    }
  })

  // 根据 meta.order 排序函数
  function sortByOrder(nodes: AppMenuOption[]) {
    const sorted = sortBy(nodes, [(node: AppMenuOption) => node.mate?.order ?? Number.MAX_SAFE_INTEGER])
    return sorted.map((node) => {
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
    // 深拷贝一次即可
    const newMenu: SimpleNode = JSON.parse(JSON.stringify(menu))

    // 递归处理 children
    if (newMenu.children?.length) {
      newMenu.children = buildPermissionTree(newMenu.children)
    }

    const permissions = newMenu.mate?.permissions
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
      delete newMenu.mate?.permissions
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
            const count = keyCountMap.get(p.value) || 0
            keyCountMap.set(p.value, count + 1)
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
  const duplicates: string[] = []
  keyCountMap.forEach((count, key) => {
    if (count > 1) {
      duplicates.push(key)
    }
  })

  return duplicates
}
