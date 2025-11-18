/**
 * 将树形结构平铺成扁平数组
 * @param tree 树形数组
 * @param childrenKey children 字段名，默认为 'children'
 * @returns 平铺后的数组
 */
export function flattenTree<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children'
): T[] {
  const result: T[] = []

  function traverse(nodes: T[]) {
    nodes.forEach((node) => {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest as T)
      if (Array.isArray(children) && children.length > 0) {
        traverse(children)
      }
    })
  }

  traverse(tree)
  return result
}
