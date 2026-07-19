import { ajaxFunctions } from '@/services/ajax/src/ajax-functions.js'
import { abortManager } from '@/services/ajax/src/models/abort-manager.js'
import { Request } from '@/services/ajax/src/models/request.js'
import { httpClient } from '@/services/ajax/src/models/http-client.js'
import { flash, log, authStore } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { servicesM } from '@/services/services-manager.js'

const generateSubdirectoryFromRouteName = (routeName, params = {}) => {
  const route = ajaxFunctions.getRoute(routeName)
  const requestId = Request.init(route, { params })

  const result = ajaxServiceInternal.generateSubdirectoryFromRoute(requestId)
  Request.remove(requestId)
  return result
}

const generateUrlFromRouteName = (routeName, params = {}, api) => {
  const route = ajaxFunctions.getRoute(routeName, api)
  if (route.global === true) {
    if (api === undefined) {
      ajaxFunctions.throwError('v_route_api_undefined', { routeName })
    }
    route.api = api
  }

  const requestId = Request.init(route, { params })

  const url = ajaxServiceInternal.generateUrlFromRoute(requestId)
  const requestParams = Request.get('params', requestId)
  Request.remove(requestId)

  if (requestParams === undefined || Object.keys(requestParams).length === 0) {
    return url
  }
  return url + `?${new URLSearchParams(requestParams).toString()}`
}

const req = async (routeName, options = {}) => {
  const route = ajaxFunctions.getRoute(routeName, options['api'])

  if (await ajaxServiceInternal.guardSkippedApi(route, routeName)) {
    return {
      api: route.api,
      route: routeName,
      status: STATUS.FORBIDDEN,
      data: {},
    }
  }

  const requestId = Request.init(route, options)

  abortManager.setAbort(Request.get('abort', requestId))

  Request.set({ url: ajaxServiceInternal.generateUrlFromRoute(requestId) }, requestId)
  let response
  try {
    response = await httpClient[route.method](requestId)
  } catch (error) {
    response = await ajaxFunctions.manageError(error)
  }

  const responseType = Request.get('responseType', requestId)
  const api = Request.get('api', requestId)
  const requestRouteName = Request.get('route.name', requestId)
  Request.remove(requestId)

  if (responseType === 'blob') {
    return ajaxServiceInternal.buildBlobResponse(api, requestRouteName, response)
  }

  return {
    api,
    route: requestRouteName,
    ...response,
  }
}

/** @type {import('vuemann/contracts/ajax-contract.js').AjaxService} */
export const ajaxService = {
  generateSubdirectoryFromRouteName,
  generateUrlFromRouteName,
  req,
}

const buildBlobResponse = (api, routeName, response) => {
  const contentDisposition = response.headers?.['content-disposition'] ?? ''
  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
  const filename = filenameMatch ? filenameMatch[1].replaceAll(/['"]/g, '').trim() : ''
  return {
    api,
    route: routeName,
    status: response.status,
    data: response.data,
    filename,
    blob: response.data,
  }
}

const generateSubdirectoryFromRoute = requestId => {
  let url = Request.get('route.url', requestId).replace(/^\/+/, '')

  const hasParams =
    Request.get('params', requestId) !== undefined &&
    Object.keys(Request.get('params', requestId)).length > 0
  if (url.includes('{') && !hasParams) {
    ajaxFunctions.throwError('error_empty_parameter', {
      routeName: Request.get('route.name', requestId),
    })
  }
  if (!hasParams) {
    return url
  }

  url = ajaxServiceInternal.injectParameters(url, requestId)

  if (url.includes('{')) {
    ajaxFunctions.throwError('error_missing_parameter', {
      routeName: Request.get('route.name', requestId),
    })
  }

  return url
}

const generateUrlFromRoute = requestId => {
  const apiUrl = ajaxFunctions.defineApiUrl(
    Request.get('api', requestId),
    Request.get('api_url', requestId),
  )
  const urlSubdirectory = ajaxServiceInternal.generateSubdirectoryFromRoute(requestId)
  return apiUrl + urlSubdirectory
}

const injectParameters = (url, requestId) => {
  const parameters = Request.get('params', requestId)
  if (parameters === undefined) {
    return url
  }

  for (const parameterName in parameters) {
    if (!url.includes(`{${parameterName}}`)) {
      continue
    }

    url = url.replace(`{${parameterName}}`, () => encodeURIComponent(parameters[parameterName]))
    delete parameters[parameterName]
  }

  Request.set({ params: parameters }, requestId)
  return url
}

const guardSkippedApi = async (route, routeName) => {
  if (!servicesM.service('auth:isApiSkipped', route.api)) {
    return false
  }

  flash.errorT('api_forbidden_for_user')
  await log.send('user_forbidden_api', {
    module: 'ajax',
    api: route.api,
    route: routeName,
    username: authStore.getCurrentUser(),
  })

  return true
}

export const ajaxServiceInternal = {
  buildBlobResponse,
  generateSubdirectoryFromRoute,
  generateUrlFromRoute,
  guardSkippedApi,
  injectParameters,
}
