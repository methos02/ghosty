import { localeService } from '@brugmann/vuemann/src/services/locale/locale-service.js'
import { localePlugin } from '@brugmann/vuemann/src/services/locale/src/locale-plugin.js'
import { useLocaleStore } from '@brugmann/vuemann/src/services/locale/src/locale-store.js'

export const localeInit = {
  dependencies: [],
  plugin: localePlugin,
  services: localeService,
  store: useLocaleStore(),
  vuemann: true,
}
