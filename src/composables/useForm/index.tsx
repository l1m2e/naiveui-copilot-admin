import type { FormInst } from 'naive-ui'
import type { FormItemProps } from '~/components/form-item'
import { cloneDeep } from 'es-toolkit'
import { assign, isArray, set } from 'es-toolkit/compat'
import { formProps, NForm } from 'naive-ui'
import FormItemGrid from '~/components/form-item-grid/index.vue'
import FormItem from '~/components/form-item/index.vue'
import { FORM_ITEM_COMPONENT_MAP } from '~/constants'

export interface UseFormInst extends FormInst {
  reset: () => void
}

export interface FormOptions<T> {
  /** form 内部创建的时候的初始化数据, 如果是 Ref 这将覆盖内部创建的 form 有利于你在二次封装组件都时候 直接将 defineModel 传入   */
  init?: T | Ref<T>
}

export function useForm<T extends any[] | Record<string, any> = Record<string, any>>(options?: FormOptions<T>) {
  const defaultData = cloneDeep(toRaw(toValue(options?.init))) as T
  const form = isRef(options?.init) ? options.init : ref<T>(cloneDeep(defaultData ?? {} as T))
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
    const resetData = isArray(form.value) ? [] : {}
    formItems.value.forEach((item) => {
      if (item.field) {
        if (item.value !== undefined) {
          set(resetData, item.field!, item.value)
        }
        else if (typeof item.component === 'string' && FORM_ITEM_COMPONENT_MAP[item.component as keyof typeof FORM_ITEM_COMPONENT_MAP]?.defaultValue !== undefined) {
          set(resetData, item.field!, FORM_ITEM_COMPONENT_MAP[item.component as keyof typeof FORM_ITEM_COMPONENT_MAP].defaultValue)
        }
        else {
          set(resetData, item.field!, null)
        }
      }
    })
    form.value = resetData as T

    if (options?.init) {
      isArray(form.value) ? form.value = cloneDeep(defaultData) : assign(form.value, cloneDeep(options.init))
    }

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
