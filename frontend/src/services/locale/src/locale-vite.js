import path from 'node:path'
import fs from 'node:fs'
import { locales } from '../../../config/locale-config.js'
import { localeHelper } from '../../../../src/core/helpers/locale-helper.js'
import { log } from '../../shortcuts/log-shortcut.js'

export const compileLocales = projectDirectory => {
  internals.cleanOldTranslations(projectDirectory)

  for (const locale of Object.keys(locales)) {
    const translations = internals.collectTranslations(projectDirectory, locale)
    internals.writeTranslationFile(projectDirectory, locale, translations)
  }
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
      if (
        !file.endsWith('.json')
        || !file.includes('locale')
        || normalizedPath.includes('/public/locales/')
      ) {
        return
      }

      compileLocales(projectDirectory)
      server.ws.send({ type: 'full-reload', path: '*' })
    },
  }
}

const cleanOldTranslations = projectDirectory => {
  const localesDir = path.resolve(projectDirectory, './public/locales')
  if (!fs.existsSync(localesDir)) {
    return
  }

  const files = fs.readdirSync(localesDir)
  for (const file of files) {
    if (!file.startsWith('app-translate')) {
      continue
    }

    const filePath = path.join(localesDir, file)
    fs.unlinkSync(filePath)
  }

  log.info(`🗑️  Anciens fichiers de traduction supprimés`)
}

const collectDirectoryTranslations = (localesPathResolved, locale, translations) => {
  const elements = fs.readdirSync(localesPathResolved, { withFileTypes: true })
  for (const element of elements) {
    if (!element.isDirectory()) {
      continue
    }

    const localePath = path.resolve(`${element.parentPath}/${element.name}/locales/${locale}`)
    if (!fs.existsSync(localePath)) {
      continue
    }

    localeHelper.mergeTranslations(localeHelper.loadLocaleFiles(localePath), translations)
  }
}

const collectGlobalTranslations = (projectDirectory, locale, translations) => {
  const globalLocales = [`./node_modules/vuemann/locales/${locale}`, `./src/locales/${locale}`]

  for (const localesPath of globalLocales) {
    const resolvedPath = path.resolve(projectDirectory, localesPath)
    if (!fs.existsSync(resolvedPath)) {
      continue
    }

    localeHelper.mergeTranslations(localeHelper.loadLocaleFiles(resolvedPath), translations)
  }
}

const collectServiceTranslations = (projectDirectory, locale, translations) => {
  const servicePaths = [
    './node_modules/vuemann/services',
    './src/services',
    './node_modules/vuemann/apis',
    './src/apis',
  ]

  for (const localesPath of servicePaths) {
    const localesPathResolved = path.resolve(projectDirectory, localesPath)
    if (!fs.existsSync(localesPathResolved)) {
      continue
    }

    internals.collectDirectoryTranslations(localesPathResolved, locale, translations)
  }
}

const collectTranslations = (projectDirectory, locale) => {
  const translations = {}

  internals.collectServiceTranslations(projectDirectory, locale, translations)
  internals.collectGlobalTranslations(projectDirectory, locale, translations)

  return translations
}

const writeTranslationFile = (projectDirectory, locale, translations) => {
  const packageJsonPath = path.resolve(projectDirectory, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const version_format = packageJson.version.replaceAll('.', '_')

  const compilePath = `./public/locales/app-translate-${locale}-${version_format}.json`
  const directoryPath = path.dirname(compilePath)
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }

  const INDENT_SPACES = 2
  fs.writeFileSync(
    path.resolve(projectDirectory, compilePath),
    JSON.stringify(translations, undefined, INDENT_SPACES) + ' ',
  )

  log.info(`✅ Fichier de traduction généré: app-translate-${locale}-${version_format}.json`)
}

export const internals = {
  cleanOldTranslations,
  collectDirectoryTranslations,
  collectGlobalTranslations,
  collectServiceTranslations,
  collectTranslations,
  writeTranslationFile,
}
