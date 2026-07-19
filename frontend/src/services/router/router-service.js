import { getRouter } from '@/services/router/src/router-plugin.js'
import { useRouterStore } from '@/services/router/src/router-store.js'
import { flash } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { FormHelper } from '@/helpers/form-helper.js'

const addRoute = route => {
  if (route.path === undefined) {
    return flash.errorT('error_route_path')
  }
  if (route.component === undefined) {
    return flash.errorT('error_route_component', { url: route.path })
  }

  getRouter().addRoute(route)
  return true
}

const currentRoute = () => {
  return getRouter().currentRoute
}

const getCurrentRouteParam = paramName => {
  const route = routerService.currentRoute().value
  const value = route.params[paramName] ?? route.query[paramName]
  return FormHelper.isEmpty(value) ? undefined : value
}

const getRoute = routeName => {
  return getRouter().resolve({ name: routeName })
}

const getRoutes = () => {
  return getRouter().getRoutes()
}

const hasApiRoute = routeName => {
  return ConfigLoader.has(`routesApi.${routeName}`)
}

const hasCurrentRouteParam = paramName => {
  return !FormHelper.isEmpty(getCurrentRouteParam(paramName))
}

const hasRoute = routeName => {
  return getRouter().hasRoute(routeName)
}

const push = async route => {
  if (typeof route === 'string') {
    // eslint-disable-next-line unicorn/no-return-array-push
    await getRouter().push(route)
    return true
  }

  if (routerServiceInternal.isUnknownNamedRoute(route)) {
    return flash.errorT('error_route_unknown', { route_name: route.name })
  }
  if (routerServiceInternal.isUnknownPath(route)) {
    return flash.errorT('error_url_unknown', { url: route })
  }

  // eslint-disable-next-line unicorn/no-return-array-push
  await getRouter().push(route)
  return true
}

const replace = async route => {
  if (typeof route === 'string') {
    await getRouter().replace(route)
    return true
  }

  if (routerServiceInternal.isUnknownNamedRoute(route)) {
    return flash.errorT('error_route_unknown', { route_name: route.name })
  }
  if (routerServiceInternal.isUnknownPath(route)) {
    return flash.errorT('error_url_unknown', { url: route })
  }

  await getRouter().replace(route)
  return true
}

const resolve = route => {
  return getRouter().resolve(route)
}

const redirectAfterLogin = async () => {
  const { urlIntented } = useRouterStore()

  await routerService.push(urlIntented.value)
  urlIntented.value = '/'
}

const setUrlIntented = url => {
  const { urlIntented } = useRouterStore()
  urlIntented.value = url
}

/** @type {import('vuemann/contracts/router-contract.js').RouterService} */
export const routerService = {
  addRoute,
  currentRoute,
  getCurrentRouteParam,
  getRoute,
  getRoutes,
  hasApiRoute,
  hasCurrentRouteParam,
  hasRoute,
  push,
  redirectAfterLogin,
  replace,
  resolve,
  setUrlIntented,
}

const isUnknownNamedRoute = route => route.name !== undefined && !getRouter().hasRoute(route.name)

const isUnknownPath = route =>
  route.name === undefined &&
  getRouter()
    .getRoutes()
    .every(routeConfig => routeConfig.path !== route.path)

export const routerServiceInternal = {
  isUnknownNamedRoute,
  isUnknownPath,
}
