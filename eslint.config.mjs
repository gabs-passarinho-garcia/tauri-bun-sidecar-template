// eslint.config.mjs na RAÍZ (Versão Final Corrigida)
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import prettierConfig from "eslint-config-prettier";

// Define os arquivos da sua aplicação principal
const tsFiles = ["apps/**/*.{ts,tsx}"];

// Define os arquivos de configuração em QUALQUER pasta
const configFiles = ["**/*.config.{js,ts}", "**/*.mjs"];

export default [
  // 1. Configuração Global de Ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/target/**",
    ],
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
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: [
          "./apps/desktop/tsconfig.json",
          "./apps/server/tsconfig.json",
        ],
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      sonarjs: sonarjs,
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      ...sonarjs.configs["recommended"].rules,
      ...prettierConfig.rules,

      // Suas regras customizadas
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/promise-function-async": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      "@/no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // SonarJS Rules - Code Quality & Bug Detection
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/non-existent-operator": "error",

      // SonarJS Rules - Code Smells & Maintainability
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/max-switch-cases": ["warn", 30],
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-duplicate-string": ["warn", { threshold: 3 }],
      "sonarjs/no-duplicated-branches": "warn",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-inverted-boolean-check": "warn",
      "sonarjs/no-nested-switch": "warn",
      "sonarjs/no-nested-template-literals": "warn",
      "sonarjs/no-redundant-boolean": "warn",
      "sonarjs/no-redundant-jump": "warn",
      "sonarjs/no-same-line-conditional": "warn",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/no-unused-collection": "warn",
      "sonarjs/no-useless-catch": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-object-literal": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/prefer-while": "warn",

      // SUA REGRA DE VOLTA AO JOGO!
      "no-restricted-syntax": [
        "warn",
        {
          selector: "ForStatement",
          message:
            "Use high-order functions like .map() instead of traditional for loops.",
        },
        {
          selector: "ForInStatement",
          message:
            "Use Object.keys(), .values(), or .entries() with high-order functions instead of for...in.",
        },
        {
          selector: "ForOfStatement",
          message: "Use high-order functions like .map() instead of for...of.",
        },
        {
          selector: "WhileStatement",
          message:
            "Consider alternatives to while loops unless managing an infinite loop or complex condition.",
        },
        {
          selector: "DoWhileStatement",
          message: "Consider alternatives to do...while loops.",
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
      ecmaVersion: "latest",
      sourceType: "module",
      // Sem parserOptions.project aqui!
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      ...prettierConfig.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
