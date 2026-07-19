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
  state.translater.global.setLocaleMessage(locale, await getLocaleMessage(locale))
}

export const localeFunctions = {
  setTranslater,
  getTranslater,
  vueTranslate,
  loadLocaleMessages,
}

const getLocaleMessage = async locale => {
  const version = getAppVersion()
  const response = await fetch(`/locales/app-translate-${locale}-${version}.json`)
  return response.json()
}

const getAppVersion = () => {
  return __APP_VERSION__.replaceAll('.', '_')
}
