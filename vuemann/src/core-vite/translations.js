import fs from 'node:fs'
import path from 'node:path'
import { localeHelper } from '../helpers/locale-helper.js'

const collectAllTranslations = projectDirectory => {
  const collectedTranslations = {}
  const localeDirectories = [
    path.resolve(projectDirectory, 'node_modules/@brugmann/vuemann/src/locales/fr'),
    path.resolve(projectDirectory, 'src/locales/fr'),
  ]

  for (const localeDirectory of localeDirectories) {
    if (!fs.existsSync(localeDirectory)) {
      continue
    }
    localeHelper.mergeTranslations(
      localeHelper.loadLocaleFiles(localeDirectory),
      collectedTranslations,
    )
  }

  return collectedTranslations
}

const resolveTranslationKey = (value, projectDirectory) => {
  if (!value.includes('.')) {
    return value
  }

  const collectedTranslations = translations.collectAllTranslations(projectDirectory)
  if (Object.keys(collectedTranslations).length === 0) {
    return value
  }

  const keys = value.split('.')
  let result = collectedTranslations

  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return value
    }
    result = result[key]
  }

  if (typeof result !== 'string') {
    return value
  }

  return result
}

export const translations = {
  collectAllTranslations,
  resolveTranslationKey,
}
