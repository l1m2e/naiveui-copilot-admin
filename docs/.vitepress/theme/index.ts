import type { EnhanceAppContext } from 'vitepress'
import { setup } from '@css-render/vue3-ssr'
import { darkTheme, dateZhCN, NConfigProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, defineComponent, h, inject, onMounted, ref } from 'vue'
import { setupYupErrorMap } from '../../../src/utils/yup-error-map'
import { registerYupExtensions } from '../../../src/utils/yup-extensions'
import DemoPreview from './components/DemoPreview.vue'
import '@vitepress-demo-preview/component/dist/style.css'
import 'uno.css'

// 设置 yup 中文错误提示和自定义验证方法
setupYupErrorMap()
registerYupExtensions()

const { Layout } = DefaultTheme

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject('css-render-collect')
    return {
      style: collect()
    }
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style
    })
  }
})

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute()
    return () => {
      return h('vitepress-path', null, [route.path])
    }
  }
})

export const NaiveUIProvider = defineComponent({
  name: 'NaiveUIProvider',
  setup(_, { slots }) {
    const { isDark } = useData()
    const isMounted = ref(false)

    onMounted(() => {
      isMounted.value = true
    })

    // 根据 VitePress DarkMode 切换 NaiveUI 主题
    const theme = computed(() => (isMounted.value && isDark.value ? darkTheme : null))

    return () =>
      h(
        NConfigProvider,
        {
          'abstract': true,
          'inlineThemeDisabled': true,
          'locale': zhCN,
          'date-locale': dateZhCN,
          'theme': theme.value
        },
        {
          default: () => [
            h(
              NMessageProvider,
              null,
              {
                default: () =>
                  h(
                    NNotificationProvider,
                    null,
                    {
                      default: () =>
                        h(Layout, null, slots)
                    }
                  )
              }
            ),
            import.meta.env.SSR ? [h(CssRenderStyle), h(VitepressPath)] : null
          ]
        }
      )
  }
})

export default {
  extends: DefaultTheme,
  Layout: NaiveUIProvider,
  enhanceApp: ({ app }: EnhanceAppContext) => {
    app.component('demo-preview', DemoPreview)
    if (import.meta.env.SSR) {
      const { collect } = setup(app)
      app.provide('css-render-collect', collect)
    }
  }
}
