import { logService } from '@brugmann/vuemann/src/services/log/log-service.js'
import { logPlugin } from '@brugmann/vuemann/src/services/log/src/log-plugin.js'
import { logRoutes } from '@brugmann/vuemann/src/services/log/src/log-routes.js'

export const logInit = {
  dependencies: ['flash'],
  plugin: logPlugin,
  routes: logRoutes,
  services: logService,
  vuemann: true,
}
