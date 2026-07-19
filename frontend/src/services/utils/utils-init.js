import { utilsService } from '@/services/utils/utils-service.js'
import { useUtilsStore } from '@/services/utils/src/utils-store.js'
import { utilsRoutes } from '@/services/utils/src/utils-routes.js'

export const utilsInit = {
  dependencies: ['ajax', 'router'],
  routes: utilsRoutes,
  services: utilsService,
  store: useUtilsStore(),
}
