import { ConfigLoader } from '@/config/config-loader.js'
import { flash, t, log } from '@/services/shortcuts/services-shortcut.js'
import { Request } from '@/services/ajax/src/models/request.js'
import { httpClient } from '@/services/ajax/src/models/http-client.js'

import {
  STATUS,
  DEFAULT_ERRORS,
  ERROR_UNKNOWN,
} from '@/constants/ajax-constants.js'

const SILENT_ERROR_STATUSES = new Set([STATUS.UNAUTHORIZED, STATUS.NOT_FOUND, STATUS.FORBIDDEN])

const manageError = async (error, fallbackRequestId) => {
  if (error.code === 'ERR_CANCELED') {
    return { data: {}, status: 499 }
  }
  if (error.response === undefined) {
    return { data: { error: 'error_server' }, status: 500 }
  }

  const requestId = error.config?.requestId ?? fallbackRequestId
  if (Request.get('empty404', requestId) && error.response.status === STATUS.NOT_FOUND) {
    return { data: [], status: STATUS.SUCCESS }
  }

  ajaxFunctionsInternal.showFlash(error, requestId)
  await ajaxFunctionsInternal.logError(error, requestId)

  return error.response
}

const throwError = (message, params = {}) => {
  const errorMessage = t(message, params)
  flash.error(errorMessage)
  throw new Error(errorMessage)
}

const getRoute = (routeName, api) => {
  const route = ajaxFunctionsInternal.getRouteFromConfig(routeName, api)

  if (route === false) {
    ajaxFunctions.throwError('v_route_unknow', { route_name: routeName })
  }
  if (route.api === undefined && route.global === undefined) {
    ajaxFunctions.throwError('v_route_api_undefined', { route_name: routeName })
  }
  if (route.method === undefined) {
    ajaxFunctions.throwError('v_route_method_undefined', {
      route_name: routeName,
      method: route.method,
    })
  }
  if (httpClient[route.method] === undefined) {
    ajaxFunctions.throwError('v_error_method_unknow', { route_name: routeName })
  }
  if (route.url === undefined) {
    ajaxFunctions.throwError('v_route_url_undefined', { route_name: routeName })
  }

  return route
}

const defineApiUrl = (apiName, apiUrl) => {
  if (apiUrl === undefined && !ConfigLoader.has(`app.apis.${apiName}.url`)) {
    ajaxFunctions.throwError('v_error_api_url', { api_name: apiName })
  }
  return apiUrl ?? ConfigLoader.find(`app.apis.${apiName}.url`)
}

const resendRequest = requestConfig => {
  return httpClient.rawRequest(requestConfig)
}

export const ajaxFunctions = {
  manageError,
  getRoute,
  defineApiUrl,
  resendRequest,
  throwError,
}

const resolveErrorKey = (status, requestId) => {
  const customErrors = Request.get('errors', requestId)
  return customErrors?.[status] ?? DEFAULT_ERRORS[status] ?? ERROR_UNKNOWN
}

const showFlash = (error, requestId) => {
  if (Request.get('flash', requestId) === false) {
    return
  }

  const noFlash = Request.get('no-flash', requestId)
  if (Array.isArray(noFlash) && noFlash.includes(error.response.status)) {
    return
  }

  if (error.response.data?.detail !== undefined) {
    log.error(error.response.data.detail)
  }

  flash.errorT(resolveErrorKey(error.response.status, requestId))
}

const logError = async (error, requestId) => {
  if (Request.get('log', requestId) === false) {
    return
  }
  if (SILENT_ERROR_STATUSES.has(error.response.status)) {
    return
  }
  await log.send(error.response.statusText, {
    module: 'ajax',
    response: error.response,
    request: { ...Request.get(requestId) },
  })
}

const getRouteFromConfig = (routeName, api) => {
  const allRoutes = ConfigLoader.find('routesApi', {})

  if (allRoutes[routeName] !== undefined) {
    return { ...allRoutes[routeName], name: routeName }
  }

  const globalRoutes = ConfigLoader.find('routesApi.global', {})
  if (globalRoutes[routeName] === undefined) {
    return false
  }

  const apiRouteKey = `${api}.${routeName}`
  const apiRoute = allRoutes[apiRouteKey]
  if (api !== undefined && apiRoute) {
    return { ...apiRoute, name: apiRouteKey }
  }

  return {
    ...globalRoutes[routeName],
    global: true,
    name: routeName,
  }
}

export const ajaxFunctionsInternal = {
  getRouteFromConfig,
  logError,
  showFlash,
}
