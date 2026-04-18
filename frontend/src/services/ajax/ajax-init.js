import { ajaxService } from '@/services/ajax/init/ajax-service.js'
import { ajaxPlugin } from '@/services/ajax/init/ajax-plugin.js'

export const ajaxInit =  {
    dependencies: ['locale'],
    services: ajaxService,
    plugin: ajaxPlugin
}
