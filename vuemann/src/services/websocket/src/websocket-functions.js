import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { flash } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const getRoute = routeApiName => {
  const route = websocketFunctionsInternal.getRouteFromConfig(routeApiName)
  if (typeof route === 'string') {
    return flash.errorT(route, { routeApiName })
  }
  return route
}

const generateUrlFromRoute = routeApiName => {
  const route = websocketFunctionsInternal.getRouteFromConfig(routeApiName)
  if (typeof route === 'string') {
    return flash.errorT(route, { routeApiName })
  }

  const api = ConfigLoader.find(`app.apis.${route.api}`)
  if (api === undefined) {
    return flash.errorT('ws_api_undefined', { api: route.api })
  }

  const api_url = api.url.replace('http', 'ws')

  return api_url + route.url
}

const getJsonFromData = content => {
  try {
    return JSON.parse(content)
  } catch {
    return false
  }
}

export const websocketFunctions = {
  getRoute,
  generateUrlFromRoute,
  getJsonFromData,
}

const getRouteFromConfig = routeApiName => {
  const route = ConfigLoader.find(`routesApi`, {})[routeApiName]

  if (route === undefined) {
    return 'ws_route_unknow'
  }
  if (route.api === undefined) {
    return 'ws_route_api_undefined'
  }
  if (route.url === undefined) {
    return 'ws_route_url_undefined'
  }

  return { ...route, name: routeApiName }
}

export const websocketFunctionsInternal = { getRouteFromConfig }
