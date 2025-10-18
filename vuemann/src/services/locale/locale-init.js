import { localeService } from './init/locale-service.js'
import { localePlugin } from './init/locale-plugin.js'

export const localeInit = {
    dependencies: [],
    services: localeService,
    plugin: localePlugin,
}
