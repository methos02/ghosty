import { servicesM } from '@/services/services-manager.js'

export const ajax = {
  req: (routeName, options = {}) => servicesM.service('ajax:req', [routeName, options]),
}

export const req = async (routeName, options = {}) => {
  return await ajax.req(routeName, options)
}

export const url = {
  generateSubdirectory: (routeName, params = {}) =>
    servicesM.service('ajax:generateSubdirectoryFromRouteName', [routeName, params]),
  generateUrl: (routeName, params = {}, api) =>
    servicesM.service('ajax:generateUrlFromRouteName', [routeName, params, api]),
}
