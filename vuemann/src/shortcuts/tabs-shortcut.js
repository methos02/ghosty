import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

export const tabs = {
  list: () => servicesM.service('tabs:list'),
}
