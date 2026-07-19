import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '../backend/**',
      'memory-bank/**',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __APP_VERSION__: 'readonly',
      },
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': [
        'error',
        { cases: { kebabCase: true, pascalCase: true } },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: ['tests/**/*.{js,vue}', '**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },

  eslintConfigPrettier,
]
