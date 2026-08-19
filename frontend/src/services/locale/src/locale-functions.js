import { createI18n } from 'vue-i18n'
import { utilsH } from '@/core/helpers/utils-helper.js'

const state = {
  translater: undefined,
}

const setTranslater = translater_instance => {
  state.translater = translater_instance
  return state.translater
}

const getTranslater = () => {
  return state.translater
}

const vueTranslate = (message, params) => {
  return localeFunctions.getTranslater().global.t(message, params)
}

const loadLocaleMessages = async locale => {
  state.translater.global.setLocaleMessage(
    locale,
    await localeFunctionsInternal.getLocaleMessage(locale),
  )
}

const init = async locale => {
  localeFunctions.setTranslater(createI18n({ locale, legacy: false }))
  await localeFunctions.loadLocaleMessages(locale)
}

export const localeFunctions = {
  setTranslater,
  getTranslater,
  vueTranslate,
  loadLocaleMessages,
  init,
}

const getLocaleMessage = async locale => {
  const version = localeFunctionsInternal.getAppVersion()
  const base = utilsH.isSsr() ? (globalThis.__SSR_ORIGIN__ ?? '') : ''
  const response = await fetch(`${base}/locales/app-translate-${locale}-${version}.json`)
  return response.json()
}

const getAppVersion = () => {
  return __APP_VERSION__.replaceAll('.', '_')
}

export const localeFunctionsInternal = {
  getLocaleMessage,
  getAppVersion,
}
