import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { transformHtmlTemplate } from '@unhead/vue/server'
import { log } from './src/services/shortcuts/log-shortcut.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--prod')
const port = Number(process.env.PORT) || 5173

// eslint-disable-next-line unicorn/no-global-object-property-assignment
globalThis.__SSR_ORIGIN__ = process.env.SSR_ORIGIN || `http://localhost:${port}`

// @see ../backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
const browserUrl = process.env.SSR_PUBLIC_URL || `http://localhost:${port}`

const BACKSLASH = String.fromCodePoint(92)
const escapeState = state =>
  JSON.stringify(state ?? {}).replaceAll(String.fromCodePoint(60), () => BACKSLASH + 'u003c')

const buildHtml = (template, rendered) => {
  const stateScript = `<script>window.__INITIAL_STATE__ = ${escapeState(rendered.state)}</script>`

  return template
    .replace('<!--app-html-->', () => rendered.html ?? '')
    .replace('<!--ssr-state-->', () => stateScript)
}

const sendRendered = async (response, rendered) => {
  const html = await transformHtmlTemplate(rendered.head, rendered.template)
  response
    .status(rendered.statusCode ?? 200)
    .set({ 'Content-Type': 'text/html' })
    .send(html)
}

const createDevelopmentServer = async app => {
  const { createServer } = await import('vite')
  const vite = await createServer({
    root: __dirname,
    appType: 'custom',
    server: { middlewareMode: true },
  })

  app.use(vite.middlewares)

  app.use('*all', async (req, response, next) => {
    try {
      const url = req.originalUrl
      const rawTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8')
      const template = await vite.transformIndexHtml(url, rawTemplate)
      const { render } = await vite.ssrLoadModule('/src/ssr/entry-server.js')

      const rendered = await render(url, { cookie: req.headers.cookie })
      await sendRendered(response, { ...rendered, template: buildHtml(template, rendered) })
    } catch (error) {
      vite.ssrFixStacktrace(error)
      next(error)
    }
  })
}

const createProductionServer = async app => {
  const clientDir = path.resolve(__dirname, 'dist/client')
  const template = fs.readFileSync(path.resolve(clientDir, 'index.html'), 'utf8')
  const { render } = await import('./dist/server/entry-server.js')

  app.use(express.static(clientDir, { index: false }))

  app.use('*all', async (req, response, next) => {
    try {
      const rendered = await render(req.originalUrl, { cookie: req.headers.cookie })
      await sendRendered(response, { ...rendered, template: buildHtml(template, rendered) })
    } catch (error) {
      next(error)
    }
  })
}

const start = async () => {
  const app = express()

  if (isProduction) {
    await createProductionServer(app)
  }

  if (!isProduction) {
    await createDevelopmentServer(app)
  }

  app.listen(port, () => {
    log.info(`SSR server (${isProduction ? 'prod' : 'dev'}) → ${browserUrl}`)
  })
}

await start()
