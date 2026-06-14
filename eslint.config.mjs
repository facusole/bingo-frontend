import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReactCompiler from 'eslint-plugin-react-compiler';
import eslintPluginNext from '@next/eslint-plugin-next';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import vercelStyleGuideTypescript from '@vercel/style-guide/eslint/typescript';
import vercelStyleGuideReact from '@vercel/style-guide/eslint/rules/react';
import vercelStyleGuideNext from '@vercel/style-guide/eslint/next';

export default [
  // Ignores configuration
  {
    ignores: ['node_modules', '.next', 'out', 'coverage', '.idea'],
  },
  // General configuration
  {
    rules: {
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: ['return', 'export'] },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
      'no-console': 'warn',
    },
  },
  // React configuration
  {
    plugins: {
      react: fixupPluginRules(eslintPluginReact),
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      'react-compiler': fixupPluginRules(eslintPluginReactCompiler),
      'jsx-a11y': fixupPluginRules(eslintPluginJsxA11y),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...vercelStyleGuideReact.rules,
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'react-compiler/react-compiler': 'error',
      'react/function-component-definition': 'off',
      'react/button-has-type': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-no-leaked-render': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  },
  // TypeScript configuration
  ...[
    ...tseslint.configs.recommended,
    {
      rules: {
        ...vercelStyleGuideTypescript.rules,
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_.*?$',
          },
        ],
      },
    },
  ],
  // Prettier configuration
  ...[
    eslintPluginPrettier,
    {
      rules: {
        'prettier/prettier': [
          'warn',
          {
            printWidth: 100,
            trailingComma: 'all',
            tabWidth: 2,
            semi: true,
            singleQuote: true,
            bracketSpacing: true,
            arrowParens: 'always',
            endOfLine: 'auto',
            plugins: ['prettier-plugin-tailwindcss'],
          },
        ],
      },
    },
  ],
  // Import configuration
  {
    plugins: {
      import: fixupPluginRules(eslintPluginImport),
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-default-export': 'off',
      'import/order': [
        'warn',
        {
          groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            // Priorizar React y Next como externos principales
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom/**/*', group: 'external', position: 'before' },
            { pattern: 'next', group: 'external', position: 'before' },
            { pattern: 'next/**/*', group: 'external', position: 'before' },
            // Configuración explícita para tus alias @/*
            {
              pattern: '@/**', // Cubre @/styles, @/utils, @/components, etc.
              group: 'internal',
              position: 'before', // O 'after' si prefieres otro orden dentro de los internos
            },
          ],
          pathGroupsExcludedImportTypes: ['type', 'react', 'next'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  // Next configuration
  {
    plugins: {
      next: fixupPluginRules(eslintPluginNext),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...vercelStyleGuideNext.rules,
      '@next/next/no-img-element': 'off',
    },
  },
];
