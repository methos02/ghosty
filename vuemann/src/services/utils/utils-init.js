import { utilsService } from '@brugmann/vuemann/src/services/utils/utils-service.js'
import { utilsPlugin } from '@brugmann/vuemann/src/services/utils/src/utils-plugin.js'
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'
import { utilsRoutes } from '@brugmann/vuemann/src/services/utils/src/utils-routes.js'

export const utilsInit = {
  dependencies: ['ajax', 'router'],
  plugin: utilsPlugin,
  routes: utilsRoutes,
  services: utilsService,
  store: useUtilsStore(),
  vuemann: true,
}
