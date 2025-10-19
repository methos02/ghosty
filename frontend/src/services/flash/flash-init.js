import { flashService } from './init/flash-service.js'
import { flashPlugin } from './init/flash-plugin.js'

export const flashInit = {
    dependencies: [],
    services: flashService,
    plugin: flashPlugin
}
