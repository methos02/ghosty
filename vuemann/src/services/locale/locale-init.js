import { localeService } from '@brugmann/vuemann/src/services/locale/init/locale-service.js'
import { localePlugin } from '@brugmann/vuemann/src/services/locale/init/locale-plugin.js'

export const localeInit = {
    dependencies: [],
    services: localeService,
    plugin: localePlugin,
}
