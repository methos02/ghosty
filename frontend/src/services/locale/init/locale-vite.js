/* eslint-disable no-console */
import path from 'node:path'
import fs from 'node:fs'
import { locales } from '../../../config/locale-config.js'

let translations

const compileLocales = projectDirectory => {
  cleanOldTranslations(projectDirectory)

  for (const locale of Object.keys(locales)) {
    translations = {}

    //récupérer les locales de chaques services
    addLocaleFromPaths(projectDirectory, locale)
    const packageJsonPath = path.resolve(projectDirectory, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version_format = packageJson.version.replaceAll('.', '_')

    const compilePath = `./public/locales/app-translate-${locale}-${version_format}.json`
    const directoryPath = path.dirname(compilePath)
    if (!fs.existsSync(directoryPath)) { fs.mkdirSync(directoryPath, { recursive: true }) }
    
    const INDENT_SPACES = 2;
    fs.writeFileSync(
      path.resolve(projectDirectory, compilePath),
      JSON.stringify(translations, undefined, INDENT_SPACES) + ' ',
    )
    
    console.log(`✅ Fichier de traduction généré: app-translate-${locale}-${version_format}.json`)
  }
}

const addLocaleFromPaths = (projectDirectory, locale) => {
  const directLocalePath = path.resolve(projectDirectory, `./src/locales/${locale}`)
  if (fs.existsSync(directLocalePath)) {
    addLocale(directLocalePath)
  }
}

function addLocale(directory) {
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name)
      if (entry.isFile() && path.extname(entry.name) !== '.json') { continue }
      
      if (entry.isDirectory()) { addLocale(entryPath); continue }
        
      const fileLocale = JSON.parse(fs.readFileSync(entryPath, 'utf8'))
      mergeTranslations(fileLocale)
    }
  } catch (error) {
      console.error(`❌ Erreur lors de la lecture du fichier ${directory}`)
      throw error
  }
}

function mergeTranslations(fileLocale, target = translations) {
  for (const key in fileLocale) {
    if (typeof fileLocale[key] === 'object') {
      if (target[key] === undefined) { target[key] = {} }
      mergeTranslations(fileLocale[key], target[key])
      continue
    }

    target[key] = fileLocale[key]
  }
}

const cleanOldTranslations = (projectDirectory) => {
  const localesDir = path.resolve(projectDirectory, './public/locales')
  if (!fs.existsSync(localesDir)) { return }

  const files = fs.readdirSync(localesDir)
  for (const file of files) {
    if (file.startsWith('app-translate')) {
      const filePath = path.join(localesDir, file)
      fs.unlinkSync(filePath)
    }
  }

  console.log(`🗑️  Anciens fichiers de traduction supprimés`)
}

export const localeVite = projectDirectory => {
  return {
    name: 'locale-multi-files',
    enforce: 'post',
    buildStart() {
      compileLocales(projectDirectory)
    },
    handleHotUpdate({ file, server }) {
      const normalizedPath = file.replaceAll('\\', '/')
      if (!file.endsWith('.json') || !file.includes('locale') || normalizedPath.includes('/public/locales/')) { return }

      compileLocales(projectDirectory)
      server.ws.send({ type: 'full-reload', path: '*' })
    },
  }
}

export const localViteFunction =  {
  mergeTranslations
}
