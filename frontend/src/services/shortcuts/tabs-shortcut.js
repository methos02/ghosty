import { servicesM } from '@/services/services-manager.js'

export const tabs = {
  list: () => servicesM.service('tabs:list'),
}
