import type { ComponentPublicInstance } from 'vue'
import { getCurrentInstance, ref } from 'vue'

/**
 * 导出子组件所有方法/属性并保持响应式。
 *
 * @template T 子组件实例类型。
 * @returns 一个元组:
 *   - `exportRef`：模板 ref 回调，绑定子组件实例。
 *   - `instance`：保存已导出的组件实例 ref。
 *
 * @example
 * const [exportRef, instance] = useComponentExport<MyComponentInstance>()
 * <template>
 *   <MyComponent :ref="exportRef" />
 * </template>
 */

export function useForwardExpose<T extends ComponentPublicInstance>() {
  const instance = ref<T>()
  const vm = getCurrentInstance()!

  const exportRef = (_instance: any) => {
    if (!_instance) return

    const originalExpose = vm.exposed || {}

    const ret: Record<string, any> = {}

    // 合并 defineExpose 暴露的内容（使用 Object.keys 避免遍历原型链上的组件实例，防止 Vue 警告）
    for (const key of Object.keys(originalExpose)) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        configurable: true,
        get: () => originalExpose[key]
      })
    }

    Object.setPrototypeOf(ret, _instance)

    // 暴露增强对象
    vm.exposed = ret

    // 保存 ref
    instance.value = ret as T
  }

  return [exportRef, instance] as const
}
