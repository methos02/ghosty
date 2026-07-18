import { ajaxService } from '@brugmann/vuemann/src/services/ajax/ajax-service.js'

export const ajaxInit = {
  dependencies: ['locale'],
  services: ajaxService,
  vuemann: true,
}
