import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"

export const t = (text_key, params = {}) => {
  return servicesM.service('locale:t', [text_key, params])
}

export const getCurrentLocale = () => {
  return servicesM.service('locale:getCurrentLocale')
}

// export const currentUser = () => {
//   return servicesM.service('auth:currentUser')
// }

// export const hasRole = (roleName) => {
//   return servicesM.service('auth:hasRole', roleName)
// }

// export const req = async (route_name, datas = {}, options = {}) => {
//   return await servicesM.service('ajax:req', [route_name, datas, options])
// }

// export const success = message => {
//   return servicesM.service('flash:success', message)
// }

// export const successT = (key, params) => {
//   return success(t(key, params))
// }

// export const error = message => {
//   return servicesM.service('flash:error', message)
// }

// export const errorT = (key, params) => {
//   return error(t(key, params))
// }

// export const validateForm = (rules, datas, options = {}) => {
//   return servicesM.service('form:validateForm', [rules, datas, options])
// }

// export const form = {
//   getErrors : () => servicesM.service('form:getErrors') ,
//   getError : (input_name) => servicesM.service('form:getError', [input_name]),
//   hasError : (input_name) => servicesM.service('form:hasError', [input_name]),
//   addError : (input_name, error) => servicesM.service('form:addError', [input_name, error]),
//   clearError : (input_name) => servicesM.service('form:clearError', [input_name]),
//   clearErrors : () => servicesM.service('form:clearErrors'),
// }

// export const log = {
//   send : (error, context) => servicesM.service('log:send', [error, context]),
// }

// export const ws = {
//   open : route_name => servicesM.service('websocket:open', [route_name]),
//   register : (route_name, event, callBack) => servicesM.service('websocket:register', [route_name, event, callBack]),
//   registerPrevent : (route_name, event, event_datas) => servicesM.service('websocket:registerPrevent', [route_name, event, event_datas]),
//   hasPrevent : (route_name, event) => servicesM.service('websocket:hasPrevent', [route_name, event]),
//   getPrevent : (route_name, event) => servicesM.service('websocket:getPrevent', [route_name, event]),
//   close : route_name => servicesM.service('websocket:close', [route_name]),
// }

// export const router = {
//   push : route => servicesM.service('router:push', [route]),
//   hasRoute : route_name => servicesM.service('router:hasRoute', [route_name]),
//   getRoutes : () => servicesM.service('router:getRoutes'),
// }

// export const route = {
//   current: () => servicesM.service('router:currentRoute'),
//   get: param_name => servicesM.service('router:getCurrentRouteParam', [param_name]),
//   has: param_name => servicesM.service('router:hasCurrentRouteParam', [param_name]),
// }

// export const url = {
//   generateUrl : (route_name, params = {}, api) => servicesM.service('ajax:generateUrlFromRouteName', [route_name, params, api]),
//   generateSubdirectory : (route_name, params = {}) => servicesM.service('ajax:generateSubdirectoryFromRouteName', [route_name, params]),
// }