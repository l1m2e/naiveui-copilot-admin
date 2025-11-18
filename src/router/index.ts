import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

router.beforeEach((to, from, next) => {
  const { addTag } = useTagsStroe()
  !to.meta?.noCache && addTag({ path: to.path, name: to.name as string, label: to.meta?.title as string || '' })
  next()
})

export default router
