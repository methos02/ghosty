import { routerService } from '@brugmann/vuemann/src/services/router/router-service.js'
import { routerPlugin } from '@brugmann/vuemann/src/services/router/src/router-plugin.js'
import { useRouterStore } from '@brugmann/vuemann/src/services/router/src/router-store.js'

export const routerInit = {
  dependencies: ['auth', 'log'],
  plugin: routerPlugin,
  services: routerService,
  store: useRouterStore(),
  vuemann: true,
}
