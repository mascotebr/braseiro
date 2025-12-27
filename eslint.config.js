import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
export default defineConfig([
  {
    files: ['**/*.js'],
    extends: ['js/recommended'],
    plugins: { js },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },
  globalIgnores(['node_modules/*', '.next/*']),
])
