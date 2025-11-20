import { isString } from 'es-toolkit'
import * as yup from 'yup'

/**
 * 扩展 Yup StringSchema 类型定义
 * 所有注释均写在 interface 中（支持 IDE 提示）
 */
declare module 'yup' {
  interface StringSchema {
    /** 手机号验证（中国大陆 11 位手机号） */
    phone: (message?: string) => this
    /** 只能填写英文字母（A-Z a-z） */
    alpha: (message?: string) => this
    /** 只能填写数字和英文字母（A-Z a-z 0-9） */
    alphanumeric: (message?: string) => this
    /** 正整数（不包含 0） */
    positiveInteger: (message?: string) => this
    /** 非负整数（包含 0） */
    nonNegativeInteger: (message?: string) => this
    /** 正数（不包含 0），可带指定小数位 默认2位 */
    positiveNumber: (decimals?: number, message?: string) => this
    /** 非负数（包含 0），可带指定小数位 默认2位 */
    nonNegativeNumber: (decimals?: number, message?: string) => this
  }
}

/** 注册所有方法 */
export function registerYupExtensions() {
  const methods = {
    phone: {
      test: (v: string) => /^1[3-9]\d{9}$/.test(v),
      message: '请输入正确的手机号'
    },
    alpha: {
      test: (v: string) => /^[A-Z]+$/i.test(v),
      message: '只能填写英文字母'
    },
    alphanumeric: {
      test: (v: string) => /^[A-Z0-9]+$/i.test(v),
      message: '只能填写数字和英文字母'
    },
    positiveInteger: {
      test: (v: string) => /^[1-9]\d*$/.test(v),
      message: '请输入正整数（不包含 0）'
    },
    nonNegativeInteger: {
      test: (v: string) => /^(?:0|[1-9]\d*)$/.test(v),
      message: '请输入非负整数（可以为 0）'
    },
    positiveNumber: {
      test: (v: string, decimals: number = 2) => {
        const regex = new RegExp(`^(?:0\\.(?!0+$)\\d{1,${decimals}}|[1-9]\\d*(\\.\\d{1,${decimals}})?)$`)
        return regex.test(v)
      },
      message: (decimals: number = 2) => `请输入正数，最多保留 ${decimals} 位小数（不包含 0）`
    },
    nonNegativeNumber: {
      test: (v: string, decimals: number = 2) => {
        const regex = new RegExp(`^(0|[1-9]\\d*)(\\.\\d{1,${decimals}})?$`)
        return regex.test(v)
      },
      message: (decimals: number = 2) => `请输入非负数，最多保留 ${decimals} 位小数（可以为 0）`
    }
  }

  Object.entries(methods).forEach(([key, config]) => {
    ;(yup.StringSchema.prototype as any)[key] = function (...args: any[]) {
      // 如果方法支持 decimals 参数，则传给 testFn 和 message
      if (args.length > 0) {
        const [param1, param2] = args
        return createOptionalTest(
          (v: string) => config.test(v, param1),
          typeof config.message === 'function' ? config.message(param1) : config.message
        ).call(this, param2)
      }
      else {
        return createOptionalTest(
          (v: string) => config.test(v),
          typeof config.message === 'function' ? config.message() : config.message
        ).call(this)
      }
    }
  })
}

/** 封装允许空值的校验函数 */
function createOptionalTest(
  testFn: (value: string) => boolean,
  defaultMessage: string
) {
  return function (this: yup.StringSchema, message?: string) {
    return this.test('custom', message || defaultMessage, (value) => {
      if (value === undefined || value === null) return true
      if (isString(value) && value.trim() === '') return true
      return testFn(String(value))
    }).nullable().notRequired()
  }
}
