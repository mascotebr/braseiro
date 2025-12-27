import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
export default defineConfig([
  ...nextVitals,
  {
    files: ['**/*.js'],
    plugins: { js, jest },
    extends: ['js/recommended', 'jest/recommended', 'prettier'],
  },
  globalIgnores(['node_modules/*', '.next/*']),
])
