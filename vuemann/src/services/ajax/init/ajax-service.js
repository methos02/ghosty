import { ajaxFunctions } from '@brugmann/vuemann/src/services/ajax/src/ajax-functions.js';
import { abortManager } from '@brugmann/vuemann/src/services/ajax/src/models/abort-manager.js';
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js';
import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js';

const req = async (route_name, datas = {}, options = {}) => {
  if(!httpClient.isDefine()) { ajaxFunctions.throwError('error_no_client') }
  const route = ajaxFunctions.getRoute(route_name, datas['api'] ?? options['api'])
  const requestId = Request.init(route, datas, options)
  
  abortManager.setAbort(Request.get('abort'))

  Request.set({ url : ajaxServiceInternal.generateUrlFromRoute(requestId) }, requestId)
  const response = await httpClient[route.method](requestId, datas).catch(async error => await ajaxFunctions.manageError(error))

  const result = { api: Request.get('api', requestId), route: Request.get('route.name', requestId), ...response }
  Request.remove(requestId)
  return result
}

const generateUrlFromRouteName = (route_name, params = {}, api) => {
  const route = ajaxFunctions.getRoute(route_name, api)
  if(route.global === true) { 
    if(api === undefined) { ajaxFunctions.throwError('v_route_api_undefined', { route_name }) }
    route.api = api
  }

  const requestId = Request.init(route, {params})

  const url = ajaxServiceInternal.generateUrlFromRoute(requestId)
  const requestParams = Request.get('params', requestId)
  Request.remove(requestId)
  
  if(requestParams === undefined || Object.keys(requestParams).length === 0) { return url }
  return url + `?${new URLSearchParams(requestParams).toString()}`
}

const generateSubdirectoryFromRouteName = (route_name, params = {}) => {
  const route = ajaxFunctions.getRoute(route_name)
  const requestId = Request.init(route, {params})

  const result = ajaxServiceInternal.generateSubdirectoryFromRoute(requestId)
  Request.remove(requestId)
  return result
}

export const ajaxService = { req, generateSubdirectoryFromRouteName, generateUrlFromRouteName }

const generateUrlFromRoute = (requestId) => {
  const apiUrl = ajaxFunctions.defineApiUrl(Request.get('api', requestId), Request.get('api_url', requestId))
  const urlSubdirectory = ajaxServiceInternal.generateSubdirectoryFromRoute(requestId)
  return apiUrl + urlSubdirectory
}

const generateSubdirectoryFromRoute = (requestId) => {
  let url = Request.get('route.url', requestId).trim('/')

  const hasParams = Request.get('params', requestId) !== undefined && Object.keys(Request.get('params', requestId)).length > 0
  if (url.includes('{') && !hasParams) { ajaxFunctions.throwError('error_empty_parameter', { route_name : Request.get('route.name', requestId) }) }
  if(!hasParams) { return url }

  url = ajaxServiceInternal.injectParameters(url, requestId)

  if (url.includes('{')) { ajaxFunctions.throwError('error_missing_parameter', { route_name : Request.get('route.name', requestId) }) }

  return url
}

const injectParameters = (url, requestId) => {
  const parameters = Request.get('params', requestId)
  if(parameters === undefined) { return url }

  for (const parameter_name in parameters) {
    if (!url.includes(`{${parameter_name}}`)) { continue }
    
    url = url.replace(`{${parameter_name}}`, parameters[parameter_name])
    delete parameters[parameter_name]
  }

  Request.set({ params: parameters }, requestId)
  return url
}

export const ajaxServiceInternal = { 
  injectParameters, 
  generateUrlFromRoute, 
  generateSubdirectoryFromRoute 
}
