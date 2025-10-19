import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { localeVite } from './src/services/locale/init/locale-vite.js'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion = packageJson.version

export default defineConfig({
  plugins:
  [
    localeVite(__dirname),
    vue()
  ],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '&': path.resolve(__dirname, './tests'),
      'vuemann': path.resolve(__dirname, '../vuemann/src')
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
