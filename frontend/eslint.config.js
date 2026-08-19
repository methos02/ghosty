// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import unicorn from 'eslint-plugin-unicorn'
import prettier from 'eslint-config-prettier'
import multilineObjectLiteral from './eslint-rules/multiline-object-literal.js'

export default [
  js.configs.recommended,
  {
    ignores: ['**/*.test.js', 'dist/**', 'coverage/**', 'memory-bank/**', '../backend/**'],
  },
  {
    files: ['**/*.vue', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        CustomEvent: 'readonly',
        WebSocket: 'readonly',
        EventTarget: 'readonly',
        __APP_VERSION__: 'readonly',
        AbortController: 'readonly',
        structuredClone: 'readonly',
        URL: 'readonly',
        process: 'readonly',
        HTMLDialogElement: 'readonly',
        Event: 'readonly',
        crypto: 'readonly',
        URLSearchParams: 'readonly',
        Headers: 'readonly',
      },
    },
    plugins: {
      vue,
      unicorn,
      local: {
        rules: {
          'multiline-object-literal': multilineObjectLiteral,
        },
      },
    },
    rules: {
      // ADR-010 (memory-bank/decisions/ADR-010-prettier-formatage.md)
      'local/multiline-object-literal': 'error',

      // JS strict
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-empty-function': ['error', { allow: ['arrowFunctions', 'asyncFunctions'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-implicit-coercion': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1], enforceConst: true }],
      complexity: ['warn', 8],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 300],
      'max-params': ['warn', 3],
      'consistent-return': 'error',

      ...unicorn.configs.recommended.rules,
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-optional-catch-binding': 'warn',
      // ADR-004 (memory-bank/decisions/ADR-004-eslint-unicorn-v66-overrides.md)
      'unicorn/prefer-https': 'off',
      // ADR-004
      'unicorn/no-unreadable-new-expression': 'off',
      // ADR-004
      'unicorn/prefer-minimal-ternary': 'off',
      // ADR-007 (memory-bank/decisions/ADR-007-eslint-unicorn-prefer-else-if.md) - contredit no-else-or-v-else
      'unicorn/prefer-else-if': 'off',
      // ADR-004
      'unicorn/comment-content': [
        'error',
        { replacements: { '\\bapi\\b': false, '\\burl\\b': false } },
      ],
      // ADR-004 - unicorn v69 retire le schema d'options de prevent-abbreviations ;
      // l'allow-list passe sur name-replacements (nouvelle regle qui reprend ce role)
      'unicorn/prevent-abbreviations': 'off',
      // ADR-004
      'unicorn/name-replacements': [
        'error',
        {
          replacements: {
            dir: false,
            props: false,
            param: false,
            params: false,
            utils: false,
            req: false,
            repository: false,
            repositories: false,
          },
        },
      ],

      // Vue.js strict
      'vue/no-mutating-props': 'error',
      'vue/require-prop-types': 'error',
      'vue/require-default-prop': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'error',
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-name-property': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/no-v-html': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-deprecated-slot-attribute': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    },
  },
  {
    files: ['**/*Config.js', '**/*config.js', '**/*.config'],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['src/contracts/*.js'],
    rules: {
      'unicorn/no-empty-file': 'off',
      'unicorn/require-module-specifiers': 'off',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        HTMLElement: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      // Les mocks remplacent des APIs absentes de jsdom : patcher globalThis et les
      // prototypes est leur raison d'etre, pas un effet de bord accidentel.
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-unnecessary-global-this': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      // Les seeders reproduisent des charges utiles JSON, ou null est une valeur servie
      // par l'API : la remplacer par undefined fausserait le scenario teste.
      'unicorn/no-null': 'off',
      // Un jeu de donnees est litteral par nature.
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
          // ADR-004
          checkDirectories: false,
        },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            pascalCase: true,
          },
          // ADR-004
          checkDirectories: false,
        },
      ],
    },
  },
  {
    files: ['src/views/**/*'],
    rules: {
      'max-lines': 'off',
      'vue/attribute-hyphenation': [
        'error',
        'never',
        { ignore: ['v-model', 'v-for', 'v-if', 'v-show', 'v-on', 'v-bind', 'v-slot'] },
      ],
    },
  },
  prettier,
  {
    files: ['**/*.vue', '**/*.js'],
    rules: {
      // ADR-010 (memory-bank/decisions/ADR-010-prettier-formatage.md)
      curly: 'error',
      // ADR-010 - Prettier ne self-close pas les composants sans enfant ; void: 'any' evite le conflit
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'never',
            component: 'always',
          },
        },
      ],
    },
  },
]
