import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { localeInit } from './src/services/locale/locale-init.js'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: 
  [
    localeInit.vite(__dirname),
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '&': path.resolve(__dirname, './tests')
    }
  },
  build: {
    outDir: '../backend/public/build',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'src/main.js'
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
