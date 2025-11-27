/** 获取 Promise 内部的类型 */
type PromiseInnerType<T extends Promise<any>> = T extends Promise<infer P>
  ? P
  : never
