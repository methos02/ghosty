import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '&': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    globalSetup: './vitest.global-setup.js',
    setupFiles: 'vitest.setup',
  },
})
