import { postcssIsolateStyles } from 'vitepress'

/**
 * PostCSS 配置
 * 使用 VitePress 官方的 postcssIsolateStyles 插件来隔离 .vp-doc 样式
 * 防止 VitePress 默认样式污染组件库（如 Naive UI）的样式
 *
 * @see https://vitepress.dev/guide/markdown#raw
 */
export default {
  plugins: [
    postcssIsolateStyles({
      // 指定需要隔离的 CSS 文件
      // 默认值: [/vp-doc\.css/, /base\.css/]
      includeFiles: [/vp-doc\.css/, /base\.css/],
    }),
  ],
}
