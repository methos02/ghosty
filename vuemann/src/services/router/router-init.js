import { routerService } from './init/router-service.js'
import { routerPlugin } from './init/router-plugin.js'

export const routerInit = {
    dependencies: [],
    services: routerService,
    plugin: routerPlugin
}
