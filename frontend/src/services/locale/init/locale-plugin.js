import { createI18n } from 'vue-i18n'
import { localeFunctions } from '../locale-functions.js'
import { localeService } from '../locale-service.js'

export const localePlugin = async () => {
  const locale = localeService.getCurrentLocale()
  const translater = createI18n({ locale, legacy: false })
  localeFunctions.setTranslater(translater)
  await localeFunctions.loadLocaleMessages(locale)
  return translater
}