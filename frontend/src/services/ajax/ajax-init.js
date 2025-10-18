import { ajaxService } from './init/ajax-service.js'
import { ajaxPlugin } from './init/ajax-plugin.js'
export const ajaxInit =  {
    dependencies: ['locale'],
    services: ajaxService,
    plugin: ajaxPlugin
}