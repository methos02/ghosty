import { localeService } from './locale-service.js'
import { localePlugin } from './locale-plugin.js'
import { localeVite } from './locale-vite.js'

export const localeInit = {
    dependencies: [],
    services: localeService,
    plugin: localePlugin,
    vite: localeVite
}