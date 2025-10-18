import { localeService } from './init/locale-service.js'
import { localePlugin } from './init/locale-plugin.js'
import { localeVite } from './init/locale-vite.js'

export const localeInit = {
    dependencies: [],
    services: localeService,
    plugin: localePlugin,
    vite: localeVite
}