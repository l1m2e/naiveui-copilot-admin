import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    ignores: [
      '.github/prompts/**/*.md',
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'camelcase': 'error',
      'comma-dangle': 'off',
      '@stylistic/comma-dangle': 'off',
      'antfu/if-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'ts/consistent-type-definitions': 'off',
      'curly': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
)
