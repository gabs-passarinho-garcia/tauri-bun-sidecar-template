// eslint.config.mjs na RAÍZ
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sonarjs from 'eslint-plugin-sonarjs';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/target/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Para o frontend
        ...globals.node,    // Para o backend
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
      'sonarjs': sonarjs,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...sonarjs.configs['recommended'].rules,
      ...prettierConfig.rules, // Desativa regras que conflitam com o Prettier

      // Suas regras customizadas
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicate-string': 'off', // Pode ser barulhento demais
    },

    // Custom Rules - Enforce High-Order Functions over Traditional Loops
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "ForStatement",
        "message": "Avoid traditional for loops. Use high-order functions like .map(), .filter(), .reduce(), .forEach() instead."
      },
      {
        "selector": "ForInStatement",
        "message": "Avoid for...in loops. Use Object.keys(), Object.values(), Object.entries() with high-order functions instead."
      },
      {
        "selector": "ForOfStatement",
        "message": "Avoid for...of loops. Use high-order functions like .map(), .filter(), .reduce(), .forEach() instead."
      },
      {
        "selector": "WhileStatement",
        "message": "Avoid while loops when possible. Consider using high-order functions or recursive approaches instead."
      },
      {
        "selector": "DoWhileStatement",
        "message": "Avoid do...while loops when possible. Consider using high-order functions or recursive approaches instead."
      }
    ],
  },
];