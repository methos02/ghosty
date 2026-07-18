import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

export const ws = {
  clear: () => servicesM.service('websocket:clear'),
  clearQueue: routeName => servicesM.service('websocket:clearQueue', [routeName]),
  close: routeName => servicesM.service('websocket:close', [routeName]),
  exist: routeName => servicesM.service('websocket:exist', [routeName]),
  get: routeName => servicesM.service('websocket:get', [routeName]),
  lastEvent: routeName => servicesM.service('websocket:lastEvent', [routeName]),
  open: routeName => servicesM.service('websocket:open', [routeName]),
  register: (routeName, events) => servicesM.service('websocket:register', [routeName, events]),
}
