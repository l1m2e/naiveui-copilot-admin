import type { ModalProps } from 'naive-ui'
import type { FormProps } from 'naive-ui/lib'
import type { FormItemGrid } from '~/components/form-item-grid'

interface FormModalOptions {
  schema: FormItemGrid | ComputedRef<FormItemGrid>
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  formProps?: FormProps
  formItemGridClass?: string
}

export function useFormModal<T extends Record<string, any>>(options: FormModalOptions) {
  const [Form, form, formRef] = useForm<T>()
  const { open, confirm, Modal: PromiseModal, showModal } = usePromiseModal<T, [data?: T]>(open => open && (form.value = open))

  function Modal(props: ModalProps & { class?: string }) {
    return (
      <PromiseModal class="max-w-2xl" {...props}>
        <Form.Root {...options.formProps}>
          <Form.ItemGrid items={toValue(options.schema)} class={options.formItemGridClass} />
        </Form.Root>

        <n-space justify="end">
          {options.showCancelButton !== false && <n-button onClick={() => showModal.value = false}>{options.cancelButtonText || '取消'}</n-button>}
          {options.showConfirmButton !== false && <n-button type="primary" onClick={onConfirm}>{options.confirmButtonText || '确定'}</n-button>}
        </n-space>
      </PromiseModal>
    )
  }

  async function onConfirm() {
    await formRef.value?.validate()
    confirm(form.value)
  }

  return {
    Modal,
    open,
    form,
    formRef,
  }
}
