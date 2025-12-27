import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
import prettier from 'eslint-config-prettier'
export default defineConfig([
  ...nextVitals,
  {
    files: ['**/*.js'],
    plugins: { js, jest, prettier },
    extends: ['js/recommended', 'jest/recommended'],
  },
  globalIgnores(['node_modules/*', '.next/*']),
])
