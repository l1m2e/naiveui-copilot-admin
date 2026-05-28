import type { Ref } from 'vue'
import { unref } from 'vue'

/**
 * 拷贝对象
 * 仅当 key 同时存在于 data 与 cloneData 时才赋值
 * 浅拷贝，如需深拷贝请自行处理 cloneData
 */
export function assignExisting<T extends Record<PropertyKey, unknown>>(
  data: T | Ref<T>,
  cloneData: Partial<T> | undefined
): void {
  const target = unref(data)
    ; (Object.keys(target) as (keyof T)[]).forEach((key) => {
    if (cloneData && Object.prototype.hasOwnProperty.call(cloneData, key)) {
      target[key] = cloneData[key] as T[keyof T]
    }
  })
}
