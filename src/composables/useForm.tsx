import type { FormInst } from 'naive-ui'
import type { FormItemProps } from '~/components/form-item'
import { formProps, NForm } from 'naive-ui'
import FormItemGrid from '~/components/form-item-grid/form-item-grid.vue'
import FormItem from '~/components/form-item/form-item.vue'

export interface UseFormInst extends FormInst {
  reset: () => void
}

export function useForm<T>() {
  const form = ref<T>({} as T)
  const formRef = ref<FormInst | null>(null)
  const { formItems, provideAutomaticCollectionSchemaKey } = useAutomaticCollectionSchema()

  const Root = defineComponent({
    props: formProps,
    setup(props, { slots }) {
      provideAutomaticCollectionSchemaKey()
      return () => (
        <NForm
          ref={formRef}
          {...props}
          model={form.value}
          v-slots={slots}
        />
      )
    },
  })

  const FormComposition = {
    Root,
    Item: FormItem,
    ItemGrid: FormItemGrid,
  }

  const resetForm = () => {
    const resetData: Record<string, any> = {}
    formItems.value.forEach((item) => {
      if (item.field) {
        resetData[item.field] = item.value !== undefined ? item.value : null
      }
    })
    form.value = resetData as T
    formRef.value?.restoreValidation()
  }

  const useFormRef = computed<UseFormInst | null>(() => {
    if (!formRef.value) return null
    return Object.assign(formRef.value, { reset: resetForm })
  })

  return [FormComposition, form, useFormRef] as const
}

export const AUTOMATIC_COLLECTION_SCHEMA_KEY = Symbol('AutomaticCollectionSchemaKey') as InjectionKey<{
  collect: (item: any) => void
  release: (field: string) => void
}>

/**
 * 注入 AUTOMATIC_COLLECTION_SCHEMA_KEY 自动采集 formItemSchema
 * 目前只用于重置表单
 */
function useAutomaticCollectionSchema() {
  const formItems = shallowRef<FormItemProps[]>([])
  const provideAutomaticCollectionSchemaKey = () => provide(AUTOMATIC_COLLECTION_SCHEMA_KEY, {
    collect: (item: FormItemProps) => {
      formItems.value.push(item)
    },
    release: (field: string) => {
      formItems.value = formItems.value.filter(item => item.field && item.field !== field)
    },
  })
  return { formItems, provideAutomaticCollectionSchemaKey }
}
