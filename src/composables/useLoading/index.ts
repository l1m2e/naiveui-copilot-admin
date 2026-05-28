import { ref } from 'vue'

interface UseLoadingOptions {
  /** 立即执行时默认不传参，需确保 fn 参数可选或无参 */
  immediate?: boolean
}
/**
 * 包装异步函数，提供 loading 状态
 * @param1 fn 需要包装的函数
 * @param2 options.immediate 是否立即执行(默认 false) 立即执行时默认不传参，需确保 fn 参数可选或无参
 * @returns [isLoading, run]
 */
export function useLoading<T extends (...args: any[]) => any>(fn: T, options: UseLoadingOptions = {}) {
  const { immediate = false } = options
  const isLoading = ref(false)

  const run = async (...args: Parameters<T>) => {
    isLoading.value = true
    try {
      const result = fn(...args)
      if (result instanceof Promise)
        return await result

      return result
    }
    finally {
      isLoading.value = false
    }
  }

  if (immediate) {
    // @ts-expect-error: 立即执行时默认不传参，需确保 fn 参数可选或无参
    run()
  }

  return [isLoading, run] as const
}
