import type { ModalProps, ModalSlots } from 'naive-ui'
import { cloneDeep } from 'es-toolkit'
import { promisWithResolvers } from '~/utils'

/**
 * 使用 Promise 弹窗
 * @param openFn 打开弹窗时的回调函数 可以处理传递过来的参数
 * @example
 * const { open, confirm, closed } = usePromiseDialog<string>(show)
 */
export function usePromiseModal<T, OpenParams extends any[] = []>(openFn?: (...args: OpenParams) => void) {
  const showModal = ref(false)

  let resolve!: (value: T) => void
  let reject!: (reason: any) => void

  async function open(...args: OpenParams) {
    const { promise, resolve: _resolve, reject: _reject } = promisWithResolvers<T>()
    resolve = _resolve
    reject = _reject
    showModal.value = true
    await nextTick()
    openFn?.(...cloneDeep(args))
    return promise
  }

  function closed() {
    reject('closed')
  }

  function confirm(value: T) {
    showModal.value = false
    resolve(cloneDeep(value))
  }

  function Modal(props: ModalProps, { slots }: { slots: ModalSlots }) {
    return (
      <n-modal
        v-model:show={showModal.value}
        on-after-leave={closed}
        v-slots={slots}
        preset="card"
        {...props}
      />
    )
  }

  return { confirm, open, closed, showModal, Modal }
}
