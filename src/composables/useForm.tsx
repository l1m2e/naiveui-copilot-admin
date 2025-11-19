import type { FormInst } from 'naive-ui'
import { formProps, NForm } from 'naive-ui'
import FormItemGrid from '~/components/form-item-grid/form-item-grid.vue'
import FormItem from '~/components/form-item/form-item.vue'

export function useForm<T>() {
  const form = ref<T>({} as T)
  const formRef = ref<FormInst | null>(null)

  const Root = defineComponent(
    {
      props: formProps,
      setup(props, { slots }) {
        return () => (
          <NForm
            ref={formRef}
            {...props}
            model={form.value}
            v-slots={slots}
          />
        )
      },
    }
  )

  const FormComposition = {
    Root,
    Item: FormItem,
    ItemGrid: FormItemGrid
  }

  return [FormComposition, form, formRef] as const
}
