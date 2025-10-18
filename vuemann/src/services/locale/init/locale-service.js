import { localeFunctions } from '../src/locale-functions.js'

const localeDefault = 'fr'

const tr = (text_key, params = {}) => {
  if (text_key.includes(':')) {
    [text_key, params] = text_key.split(':')
    params = localeServiceInternal.extractParams(params)
  }

  return localeFunctions.vueTranslate(text_key, params)
}

const getCurrentLocale =  () => {
  const currentLocale = localStorage.getItem('locale')
  if(currentLocale !== null) { return currentLocale }

  localStorage.setItem('locale', localeDefault)
  return localeDefault
}

export const localeService = { tr, getCurrentLocale }

const extractParams = params => {
  if(params === "") {
    console.error('extract_params_empty')
    return {}
  }

  const paramaterFormat = []
  for (const parameter of params.split('|')) {
    const [key, ...value] = parameter.split('=')
    const finalValue = value.join('=');

    if(finalValue === "") {
      console.error('extract_params_missing_value', {key})
      continue
    }

    paramaterFormat.push([key, finalValue])
  }

  return Object.fromEntries(paramaterFormat)
}

export const localeServiceInternal = { extractParams }
