import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    ignores: [
      '.github/prompts/**/*.md',
      'src/api/generated/**',
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'camelcase': ['error', { properties: 'never' }],
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
