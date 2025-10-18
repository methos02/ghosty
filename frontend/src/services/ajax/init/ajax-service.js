import { ajaxFunctions } from '../src/ajax-functions.js';
import { abortManager } from '../src/models/abort-manager.js';
import { Request } from '../src/models/request.js';
import { httpClient } from '../src/models/http-client.js';

const req = async (route_name, datas = {}, options = {}) => {
  if(!httpClient.isDefine()) { ajaxFunctions.throwError('error_no_client') }
  const route = ajaxFunctions.getRoute(route_name, datas['api'] ?? options['api'])
  Request.set(route, datas, options)
  
  abortManager.setAbort(Request.get('abort'))

  const url = ajaxServiceInternal.generateUrlFromRoute(route)
  const response = await httpClient[route.method](url, datas).catch(async error => await ajaxFunctions.manageError(error))

  return { api: Request.get('api'), route: Request.get('route'), ...response }
}

const generateUrlFromRouteName = (route_name, params = {}, api) => {
  const route = ajaxFunctions.getRoute(route_name, api)
  if(route.global === true) { 
    if(api === undefined) { ajaxFunctions.throwError('v_route_api_undefined', { route_name }) }
    route.api = api
  }

  Request.set(route, {params})

  const url = ajaxServiceInternal.generateUrlFromRoute(route)
  if(Request.get('params') === undefined || Object.keys(Request.get('params')).length === 0) { return url }

  return url + `?${new URLSearchParams(Request.get('params')).toString()}`
}

const generateSubdirectoryFromRouteName = (route_name, params = {}) => {
  const route = ajaxFunctions.getRoute(route_name)
  Request.set(route, {params})

  return ajaxServiceInternal.generateSubdirectoryFromRoute(route)
}

export const ajaxService = { req, generateSubdirectoryFromRouteName, generateUrlFromRouteName }

const generateUrlFromRoute = (route) => {
  const api_url = ajaxFunctions.defineApiUrl(Request.get('api'), Request.get('api_url'))
  const url_subdirectory = ajaxServiceInternal.generateSubdirectoryFromRoute(route)
  return api_url + url_subdirectory
}

const generateSubdirectoryFromRoute = (route) => {
  let url = route.url.trim('/')

  const hasParams = Request.get('params') !== undefined && Object.keys(Request.get('params')).length > 0
  if (url.includes('{') && !hasParams) { ajaxFunctions.throwError('error_empty_parameter', { route_name : route.name }) }
  if(!hasParams) { return url }

  for (const parameter_name of Object.keys(Request.get('params'))) {
    if (!url.includes(`{${parameter_name}}`)) { continue }

    url = ajaxServiceInternal.injectParameter(url, parameter_name)
  }

  if (url.includes('{')) { ajaxFunctions.throwError('error_missing_parameter', { route_name : route.name }) }

  return url
}

const injectParameter = (url, parameter_name) => {
  url = url.replace(`{${parameter_name}}`, Request.get('params')[parameter_name])
  if (Request.get('params') !== undefined) { delete Request.get('params')[parameter_name] }

  return url
}

export const ajaxServiceInternal = { injectParameter, generateUrlFromRoute, generateSubdirectoryFromRoute }