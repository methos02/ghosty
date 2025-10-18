import axios from 'axios'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { flash, t, log } from '@brugmann/vuemann/src/services/services-helper.js'
import { Request } from '@brugmann/vuemann/src/services/ajax/src/models/request.js'
import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js'
import { STATUS } from '@brugmann/vuemann/src/services/ajax/ajax-constants.js'

const manageError = async error => {
    const requestId = error.config.requestId
    if (Request.get('empty404', requestId) && error.response.status === STATUS.NOT_FOUND) {
        return { data: [],  status: STATUS.SUCCESS }
    }

    if (error.code === 'ERR_CANCELED') { return { data: {}, status: 499 } }
    if (error.response === undefined) { return { data: {error: 'error_back'}, status: 500 } }

    ajaxFunctionsInternal.showFlash(error)
    if(Request.get('log', requestId) !== false && ![STATUS.UNAUTHORIZED, STATUS.NOT_FOUND, STATUS.FORBIDDEN].includes(error.response.status)) { 
        await log.send(error.response.statusText, { 
            module: 'ajax', 
            response: error.response, 
            request: { ...Request.get(requestId) }
        })
    }

    return error.response
}

const throwError = (message, params = {}) => {
    const errorMessage = t(message, params)
    flash.error(errorMessage)
    throw new Error(errorMessage)
}

const getRoute = (route_name, api) => {
    const route = ajaxFunctionsInternal.getRouteFromConfig(route_name, api)

    if(route === false) { ajaxFunctions.throwError('v_route_unknow', { route_name }) }
    if(route.api === undefined && route.global === undefined) { ajaxFunctions.throwError('v_route_api_undefined', { route_name }) }
    if(route.method === undefined) { ajaxFunctions.throwError('v_route_method_undefined', { route_name, method : route.method }) }
    if(httpClient[route.method] === undefined) { ajaxFunctions.throwError('v_error_method_unknow', { route_name }) }
    if(route.url === undefined) { ajaxFunctions.throwError('v_route_url_undefined', { route_name }) }

    return route
}

const defineApiUrl = (api_name, api_url) => {
    if(api_url === undefined && ConfigLoader.get(`app.apis.${api_name}.url`) === undefined) { ajaxFunctions.throwError('v_error_api_url', { api_name }) }
    return api_url ?? ConfigLoader.get(`app.apis.${api_name}.url`)
} 

const resendRequest = requestConfig => {
    return axios(requestConfig)
}

export const ajaxFunctions = { manageError, getRoute, defineApiUrl, resendRequest, throwError }

const showFlash = error => {
    const requestId = error.config.requestId
    if (Request.get('flash', requestId) === false || (Array.isArray(Request.get('no-flash', requestId)) && Request.get('no-flash', requestId).includes(error.response.status))) { return }
    if(error.response.data?.detail !== undefined) { flash.error(error.response.data?.detail); return }
    
    const error_message = error.response.status < STATUS.ERROR_SERVER ? 'error_front' : 'error_back' 
    flash.errorT(error_message)
}

const getRouteFromConfig = (route_name, api) => {
    if(ConfigLoader.get(`routesApi`, {})[route_name] !== undefined) { return {...ConfigLoader.get(`routesApi`)[route_name], name: route_name } }
    if(ConfigLoader.get(`routesApi.global`)[route_name] === undefined) { return false }
    if(api !== undefined && ConfigLoader.get(`routesApi`)[`${api}.${route_name}`]) { return {...ConfigLoader.get(`routesApi`)[`${api}.${route_name}`], name: `${api}.${route_name}`} }

    return {...ConfigLoader.get(`routesApi.global`)[route_name], global : true, name: route_name}
}

export const ajaxFunctionsInternal = { showFlash, getRouteFromConfig }