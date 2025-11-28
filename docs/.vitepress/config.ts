import { defineConfig } from 'vitepress'
import { setupMarkdown } from './config/markdown'
import { themeConfig } from './config/theme'
import { viteConfig } from './config/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitesse Lite',
  description: '基于 Vitesse 和 Naive UI 的轻量级 Vue 3 项目模板',
  lang: 'zh-CN',

  vite: viteConfig,

  markdown: {
    config: setupMarkdown,
  },

  themeConfig,
})
