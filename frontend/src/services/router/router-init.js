import { routerService } from '@/services/router/router-service.js'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { useRouterStore } from '@/services/router/src/router-store.js'

export const routerInit = {
  dependencies: ['auth'],
  plugin: routerPlugin,
  services: routerService,
  store: useRouterStore(),
}
