import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import playwrightPlugin from 'eslint-plugin-playwright';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      playwright: playwrightPlugin,
      prettier: prettierPlugin
    },

    rules: {
      /* ===============================
         TypeScript – Code Safety
         =============================== */
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ],

      /* ===============================
         Playwright – Test Discipline
         =============================== */
      'playwright/no-focused-test': 'error',   // prevents test.only
      'playwright/no-skipped-test': 'warn',    // warns on test.skip
      'playwright/no-page-pause': 'error',     // blocks page.pause()
      'playwright/expect-expect': 'error',     // ensures assertions exist

      /* ===============================
         General Quality
         =============================== */
      'no-console': 'warn',
      'prettier/prettier': 'error'
    }
  },

  // Disable ESLint rules that conflict with Prettier
  prettierConfig
];
