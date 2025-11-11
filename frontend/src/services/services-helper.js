import { servicesM } from "./services-manager.js"

export const t = (text_key, params = {}) => {
  return locale.t(text_key, params)
}

export const locale = {
  current: () => servicesM.service('locale:getCurrentLocale'),
  t: (text_key, params = {}) => servicesM.service('locale:tr', [text_key, params]),
}

export const auth = {
  user: () => servicesM.service('auth:getCurrentUser'),
  isAuthenticated: () => servicesM.service('auth:isAuthenticated'),
  hasRole: (roleName) => servicesM.service('auth:hasRole', roleName),
  login: (email, password) => servicesM.service('auth:login', [email, password]),
  register: (datas) => servicesM.service('auth:register', [datas]),
  logout: () => servicesM.service('auth:logout'),
  fetchCurrentUser: () => servicesM.service('auth:fetchCurrentUser'),
  showLoginDialog: () => servicesM.service('auth:showLoginDialog'),
  showRegisterDialog: () => servicesM.service('auth:showRegisterDialog'),
  openLoginDialog: () => servicesM.service('auth:openLoginDialog'),
  openRegisterDialog: () => servicesM.service('auth:openRegisterDialog'),
  closeDialogs: () => servicesM.service('auth:closeDialogs'),
}

export const req = async (route_name, datas = {}, options = {}) => {
  return await ajax.req(route_name, datas, options)
}

export const ajax = {
  req: (route_name, datas = {}, options = {}) => servicesM.service('ajax:req', [route_name, datas, options]),
}

export const flash = {
  success: (message) => servicesM.service('flash:success', message),
  error: (message) => servicesM.service('flash:error', message),
  successT: (key, params) => servicesM.service('flash:success', t(key, params)),
  errorT: (key, params) => servicesM.service('flash:error', t(key, params)),
}

export const form = {
  validate: (rules, datas, options = {}) => servicesM.service('form:validateForm', [rules, datas, options]),
  getErrors : () => servicesM.service('form:getErrors') ,
  getError : (input_name) => servicesM.service('form:getError', [input_name]),
  hasError : (input_name) => servicesM.service('form:hasError', [input_name]),
  addError : (input_name, error) => servicesM.service('form:addError', [input_name, error]),
  addErrors : (errors) => servicesM.service('form:addErrors', [errors]),
  clearError : (input_name) => servicesM.service('form:clearError', [input_name]),
  clearErrors : () => servicesM.service('form:clearErrors'),
  mapFields : (validationErrors, mapping) => servicesM.service('form:mapFields', [validationErrors, mapping]),
}

export const router = {
  push : route => servicesM.service('router:push', [route]),
  hasRoute : route_name => servicesM.service('router:hasRoute', [route_name]),
  getRoutes : () => servicesM.service('router:getRoutes'),
}

export const route = {
  current: () => servicesM.service('router:currentRoute'),
  get: param_name => servicesM.service('router:getCurrentRouteParam', [param_name]),
  has: param_name => servicesM.service('router:hasCurrentRouteParam', [param_name]),
}

export const url = {
  generateUrl : (route_name, params = {}, api) => servicesM.service('ajax:generateUrlFromRouteName', [route_name, params, api]),
  generateSubdirectory : (route_name, params = {}) => servicesM.service('ajax:generateSubdirectoryFromRouteName', [route_name, params]),
}

export const utils = {
  hydrate : (datas, keys, config = {}) => servicesM.service('utils:hydrate', [datas, keys, config]),
}
