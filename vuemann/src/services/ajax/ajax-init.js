import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js'
import { ajaxPlugin } from '@brugmann/vuemann/src/services/ajax/init/ajax-plugin.js'

export const ajaxInit =  {
    dependencies: ['locale'],
    services: ajaxService,
    plugin: ajaxPlugin
}
