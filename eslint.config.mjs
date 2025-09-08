// eslint.config.mjs na RAÍZ (Versão Final Corrigida)
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sonarjs from 'eslint-plugin-sonarjs';
import prettierConfig from 'eslint-config-prettier';

// Define os arquivos da sua aplicação principal
const tsFiles = ['apps/**/*.{ts,tsx}'];

// Define os arquivos de configuração
const configFiles = ['*.mjs', '*.config.js', '*.config.ts'];

export default [
  // 1. Configuração Global de Ignores
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/target/**'],
  },

  // 2. Configuração ESTRITA para o Código da Aplicação
  {
    files: tsFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: ['./apps/desktop/tsconfig.json', './apps/server/tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      sonarjs: sonarjs,
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      ...sonarjs.configs['recommended'].rules,
      ...prettierConfig.rules,

      // Suas regras customizadas
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],

      // SUA REGRA DE VOLTA AO JOGO!
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'ForStatement',
          message: 'Use high-order functions like .map() instead of traditional for loops.',
        },
        {
          selector: 'ForInStatement',
          message: 'Use Object.keys(), .values(), or .entries() with high-order functions instead of for...in.',
        },
        {
          selector: 'ForOfStatement',
          message: 'Use high-order functions like .map() instead of for...of.',
        },
        {
          selector: 'WhileStatement',
          message: 'Consider alternatives to while loops unless managing an infinite loop or complex condition.',
        },
        {
          selector: 'DoWhileStatement',
          message: 'Consider alternatives to do...while loops.',
        },
      ],
    },
  },

  // 3. Configuração BÁSICA para Arquivos de Configuração
  {
    files: configFiles,
    languageOptions: {
      globals: { ...globals.node },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];