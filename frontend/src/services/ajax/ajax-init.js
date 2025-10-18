import { ajaxService } from './ajax-service.js'
export const ajaxInit =  {
    dependencies: ['locale'],
    services: ajaxService,
    plugin: ajaxPlugin
}