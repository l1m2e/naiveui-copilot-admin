import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import router from '~/router'
import { registerYupExtensions, setupYupErrorMap } from '~/utils'

import App from './App.vue'

import './styles/main.css'
import 'uno.css'

// yup 扩展注册和错误信息配置
setupYupErrorMap()
registerYupExtensions()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
