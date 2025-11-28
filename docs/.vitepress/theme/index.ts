import type { EnhanceAppContext } from 'vitepress'
import naive from 'naive-ui'
import DefaultTheme from 'vitepress/theme'
import { setupYupErrorMap } from '../../../src/utils/yup-error-map'
import { registerYupExtensions } from '../../../src/utils/yup-extensions'
import DemoPreview from './components/DemoPreview.vue'
import Layout from './Layout.vue'
import '@vitepress-demo-preview/component/dist/style.css'
import 'uno.css'

// 设置 yup 中文错误提示和自定义验证方法
setupYupErrorMap()
registerYupExtensions()

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('demo-preview', DemoPreview)
    app.use(naive)
  },
}
