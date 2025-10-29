import { createRouter, createWebHistory } from 'vue-router'
import Layout from '~/layout/layout.vue'

const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('~/pages/index/index.vue'),
        name: 'Index',
        meta: { title: '工作站', icon: 'i-yst-menu-home', keepAlive: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

export default router
