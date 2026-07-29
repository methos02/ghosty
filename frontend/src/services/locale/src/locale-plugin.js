import { localeFunctions } from '@/services/locale/src/locale-functions.js'
import { localeStore } from '@/services/locale/src/locale-store.js'
import { ssrStorage } from '@/helpers/ssr-storage.js'

const state = {
  translaterPromise: undefined,
}

export const localePlugin = async () => {
  if (state.translaterPromise === undefined) {
    state.translaterPromise = localePluginInternal.setupTranslater()
  }
  const translater = await state.translaterPromise

  return {
    install(app) {
      app.use(translater)
    },
  }
}

const setupTranslater = async () => {
  const savedLocale = ssrStorage.getItem('locale') || 'fr'
  localeStore.set(savedLocale)
  await localeFunctions.init(savedLocale)
  return localeFunctions.getTranslater()
}

export const localePluginInternal = {
  setupTranslater,
}
