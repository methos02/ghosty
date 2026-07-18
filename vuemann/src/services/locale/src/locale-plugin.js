import { createI18n } from 'vue-i18n'
import { localeFunctions } from '@brugmann/vuemann/src/services/locale/src/locale-functions.js'
import { localeStore } from '@brugmann/vuemann/src/services/locale/src/locale-store.js'

export const localePlugin = async () => {
  const savedLocale = localStorage.getItem('locale') || 'fr'
  localeStore.set(savedLocale)

  const translater = createI18n({ locale: savedLocale, legacy: false })
  localeFunctions.setTranslater(translater)
  await localeFunctions.loadLocaleMessages(savedLocale)

  return {
    install(app) {
      app.use(translater)
    },
  }
}
