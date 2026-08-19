import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { localeVite } from './src/services/locale/src/locale-vite.js'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const appVersion = packageJson.version

const hmrPort = Number(process.env.HMR_PORT) || Number(process.env.PORT) + 1 || 24678

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
      '&': path.resolve(__dirname, './tests')
    }
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    // @see ../backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
    allowedHosts: ['app.ghosty.local'],
    hmr: { port: hmrPort },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
