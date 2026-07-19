import { localeFunctions } from '@/services/locale/src/locale-functions.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'

const localeDefault = 'fr'

const t = (textKey, params = {}) => {
  if (!textKey.includes(':')) {
    return localeFunctions.vueTranslate(textKey, params)
  }

  const [key, rawParams] = textKey.split(':')
  return localeFunctions.vueTranslate(key, localeServiceInternal.extractParams(rawParams))
}

const getCurrentLocale = () => {
  const currentLocale = localStorage.getItem('locale')
  if (currentLocale !== null) {
    return currentLocale
  }

  localStorage.setItem('locale', localeDefault)
  return localeDefault
}

/** @type {import('vuemann/contracts/locale-contract.js').LocaleService} */
export const localeService = {
  getCurrentLocale,
  t,
}

const extractParams = params => {
  if (params === '') {
    flash.errorT('extract_params_empty')
    return {}
  }

  const parameterEntries = []
  for (const parameter of params.split('|')) {
    const [key, ...value] = parameter.split('=')
    const finalValue = value.join('=')

    if (finalValue === '') {
      flash.errorT('extract_params_missing_value', { key })
      continue
    }

    parameterEntries.push([key, finalValue])
  }

  return Object.fromEntries(parameterEntries)
}

export const localeServiceInternal = { extractParams }
