import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '指南',
      items: [
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '项目结构', link: '/guide/project-structure' },
        { text: '路由配置', link: '/guide/routing' },
      ],
    },
  ],
  '/composables/': [
    {
      text: '组合式函数',
      items: [
        { text: 'useForm', link: '/composables/use-form' },
        { text: 'useTable', link: '/composables/use-table' },
      ],
    },
  ],
  '/components/': [
    {
      text: '组件',
      items: [
        { text: '概述', link: '/components/overview' },
      ],
    },
    {
      text: '基础组件',
      items: [
        { text: 'Button 按钮', link: '/components/button' },
      ],
    },
    {
      text: '表单组件',
      items: [
        { text: 'Form 表单', link: '/components/form' },
      ],
    },
  ],
}
