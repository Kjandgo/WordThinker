import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'dist-ssr/**', 'coverage/**', 'n8n/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      ...js.configs.recommended.rules,
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['*.config.js', 'scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
