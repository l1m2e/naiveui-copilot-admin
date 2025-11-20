import type { FormItemRule } from 'naive-ui'
import type * as yup from 'yup'

/**
 * 将 Yup schema 转换为 naive-ui 的 FormItemRule
 * 统一使用异步验证器以支持所有类型的验证（包括同步和异步）
 */
export function yupToRule<T extends yup.Schema>(schema: T): FormItemRule {
  const required = schema.describe().tests?.some((test: any) => test.name === 'required') ?? false

  // 统一使用异步验证器，兼容同步和异步验证
  return {
    required,
    asyncValidator: async (_rule, value) => {
      try {
        // 使用 validate 而非 validateSync，自动支持异步测试
        await schema.validate(value)
      }
      catch (error: any) {
        throw new Error(error.message || '验证失败')
      }
    },
    trigger: ['blur', 'change'],
  }
}
