/**
 * composables 之间共享的 API 类型工具。
 *
 * - ApiFunction：任意异步函数
 * - ApiFunctionWithHeadParam：第一个入参固定为 params 的异步函数（列表接口常见）
 */

export type ApiFunction = (...args: any[]) => Promise<any>
export type ApiFunctionWithHeadParam = (params: any, ...rest: any[]) => Promise<any>

export type ApiArgs<T extends ApiFunction> = Parameters<T>

export type ApiParams<T extends ApiFunction> = ApiArgs<T> extends [infer P, ...any[]]
  ? P
  : never

export type ApiRest<T extends ApiFunction> = ApiArgs<T> extends [any, ...infer R]
  ? R
  : []

export type FastParams<T extends ApiFunction> = ApiArgs<T> extends []
  ? never
  : Partial<NonNullable<ApiParams<T>>>

/** 适用于可能没有入参的 API */
export type FetchArgs<T extends ApiFunction> = ApiArgs<T> extends []
  ? []
  : [FastParams<T>?, ...ApiRest<T>]

/** 适用于第一个入参固定为 params 的 API */
export type FetchArgsWithHeadParam<T extends ApiFunctionWithHeadParam> = [FastParams<T>?, ...ApiRest<T>]
