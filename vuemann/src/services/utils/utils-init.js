import { utilsService } from './init/utils-service.js'
import { utilsPlugin } from './init/utils-plugin.js'

export const utilsInit = {
    dependencies: ['ajax', 'router'],
    services: utilsService,
    plugin: utilsPlugin
}
