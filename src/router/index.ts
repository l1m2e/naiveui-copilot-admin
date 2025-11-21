import { createDiscreteApi } from 'naive-ui'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const { loadingBar } = createDiscreteApi(['loadingBar'])

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

router.beforeEach((to, from, next) => {
  loadingBar.start()
  const { addTag } = useTagsStroe()
  !to.meta?.noCache && addTag({ path: to.path, name: to.name as string, label: to.meta?.title as string || '' })
  next()
})

router.afterEach(() => {
  loadingBar.finish()
})

router.onError(() => {
  loadingBar.error()
})

export default router
