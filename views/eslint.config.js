import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Context modules and the router map intentionally export non-component values
    // (custom hooks and `router`), which is valid architecture for this project.
    files: ['src/context/**/*.jsx', 'src/routes/index.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])


// ESLint config for the client-side React application.
// We use it so that we can catch common bugs and enforce code quality and consistency across the codebase. It helps us maintain a clean and error-free codebase as we develop the application.
// Uses ESLint's new flat config format with `defineConfig` for better performance and flexibility.
// Extends recommended rules from ESLint core, React Hooks plugin, and React Refresh plugin for Vite.
// Applies to all .js and .jsx files, with specific overrides for context modules and the router map to allow non-component exports.