import type { FormItemRule } from 'naive-ui'
import type * as yup from 'yup'
import { get } from 'es-toolkit/compat'

/**
 * Yup schema → naive-ui FormItemRule
 *
 * - field 路径语法完全兼容 es-toolkit/get
 * - 支持任意 object / array 混合
 * - 支持 yup.ref（通过 context）
 */
export function yupToRule<T extends yup.Schema>(schema: T, field?: string, model?: Record<string, any> | any[],): FormItemRule {
  const description = schema.describe()
  const required = description?.optional === false

  return {
    required,
    trigger: ['blur', 'change'],
    asyncValidator: async (_rule, value) => {
      try {
        // 没有 path / model，退化为普通校验
        if (!field || !model) {
          return await schema.validate(value)
        }
        const fieldValue = get(model, field)
        await schema.validate(fieldValue, { context: model })
      }
      catch (error: any) {
        throw new Error(error?.message || '验证失败')
      }
    },
  }
}
