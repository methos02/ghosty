import { localeService } from '@/services/locale/locale-service.js'
import { localePlugin } from '@/services/locale/src/locale-plugin.js'
import { useLocaleStore } from '@/services/locale/src/locale-store.js'

export const localeInit = {
  dependencies: [],
  plugin: localePlugin,
  services: localeService,
  store: useLocaleStore(),
}
