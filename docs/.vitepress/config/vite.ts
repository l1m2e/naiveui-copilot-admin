import type { UserConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import llmstxt from 'vitepress-plugin-llms'

export const viteConfig: UserConfig = {
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../../../src', import.meta.url)),
    },
  },
  plugins: [
    // LLMs 文档生成插件
    llmstxt(),

    // UnoCSS 插件 - 指定配置文件路径
    UnoCSS(fileURLToPath(new URL('../../../uno.config.ts', import.meta.url))),

    // Vue JSX 插件
    vueJsx(),

    // 自动导入
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
        {
          yup: [
            ['*', 'yup'],
          ],
        },
      ],
      dts: fileURLToPath(new URL('../auto-imports.d.ts', import.meta.url)),
      dirs: [
        fileURLToPath(new URL('../../../src/composables/*/index.{ts,tsx}', import.meta.url)),
      ],
      vueTemplate: true,
    }),

    // 组件自动导入
    Components({
      resolvers: [NaiveUiResolver()],
      dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.tsx$/, /\.md$/],
      dirs: [
        fileURLToPath(new URL('../../../src/components', import.meta.url)),
      ],
    }),
  ],
}
