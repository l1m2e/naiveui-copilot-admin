import { ref } from 'vue'

/**
 * 包装异步函数，提供 loading 状态
 * @param fn 需要包装的函数
 * @returns [isLoading, run]
 */
export function useLoading<T extends (...args: any[]) => any>(fn: T) {
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

  return [isLoading, run] as const
}
