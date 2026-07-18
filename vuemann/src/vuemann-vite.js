/* eslint-disable no-console */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageCopier } from './core-vite/image-copier.js'
import { configExtractor } from './core-vite/config-extractor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const vuemannVite = projetcDirectory => {
  return {
    name: 'vuemann',
    enforce: 'pre',
    transformIndexHtml(html) {
      const appTitle = configExtractor.extractAppTitle(projetcDirectory)
      if (!appTitle) {
        return html
      }
      return html.replace(/<title>[^<]*<\/title>/, () => `<title>${appTitle}</title>`)
    },
    buildStart() {
      const publicDirectory = path.resolve(projetcDirectory, 'public/images/vuemann')

      if (fs.existsSync(publicDirectory)) {
        fs.rmSync(publicDirectory, { recursive: true, force: true })
      }
      fs.mkdirSync(publicDirectory, { recursive: true })

      console.log('Copie des images vers le dossier public...')

      imageCopier.copyVuemannImages(__dirname, publicDirectory)
      imageCopier.copyServiceImages(__dirname, publicDirectory)
    },
  }
}
