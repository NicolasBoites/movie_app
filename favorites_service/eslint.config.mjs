import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends('@nestjs'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
      prettier,
    },
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['.eslintrc.js'],
  },
]; 