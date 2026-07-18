import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('router')

export const routerStore = {
  get urlIntented() {
    return _store().urlIntented
  },
}

export const router = {
  getRoutes: () => servicesM.service('router:getRoutes'),
  hasRoute: routeName => servicesM.service('router:hasRoute', [routeName]),
  push: route => servicesM.service('router:push', [route]),
  replace: route => servicesM.service('router:replace', [route]),
  resolve: route => servicesM.service('router:resolve', [route]),
}

export const route = {
  current: () => servicesM.service('router:currentRoute'),
  get: paramName => servicesM.service('router:getCurrentRouteParam', [paramName]),
  has: paramName => servicesM.service('router:hasCurrentRouteParam', [paramName]),
}
