import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

// eslint.config.js
export default tsEslint.config(
  ...eslintPluginStorybook.configs['flat/recommended'],
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react: reactPlugin,
      prettier,
      'react-hooks': reactHooks,
    },
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    rules: {
      ...eslintConfigPrettier.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
    },
  },
  {
    ignores: [
      '!.storybook',
      '.firebase',
      '.github/*',
      '.vscode/*',
      'data/*',
      'dist/*',
      'forklift/*',
      'maps/*',
      'mockups/*',
      'node_modules/*',
      'package-lock.json',
      'public/*',
      'scripts/*',
    ],
  },
);
