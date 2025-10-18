import axios from 'axios'
import { ConfigLoader } from 'vuemann/config/config-loader.js'
import { Request } from './models/request.js'
import { httpClient } from './models/http-client.js'
import { STATUS } from '../ajax-constants.js'
import { error, t } from '@/services/services-helper.js'

const manageError = async errorResponse => {
    if (errorResponse.code === 'ERR_CANCELED') { return { data: {}, status: 499 } }
    if (errorResponse.response === undefined) { return { data: {error: 'error_back'}, status: 500 } }

    ajaxFunctionsInternal.showFlash(errorResponse)

    return errorResponse.response
}

const throwError = (message, params = {}) => {
    const errorMessage = t(message, params)
    error(errorMessage)
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

const showFlash = errorResponse => {
    if (Request.get('flash') === false || (Array.isArray(Request.get('no-flash')) && Request.get('no-flash').includes(errorResponse.response.status))) { return }
    if(errorResponse.response.data?.detail !== undefined) {
        const message = t(errorResponse.response.data?.detail)
        error(message)
        return
    }

    const error_message = errorResponse.response.status < STATUS.ERROR_SERVER ? 'error_front' : 'error_back'
    const message = t(error_message)
    error(message)
}

const getRouteFromConfig = (route_name, api) => {
    if(ConfigLoader.get(`routesApi`, {})[route_name] !== undefined) { return {...ConfigLoader.get(`routesApi`)[route_name], name: route_name } }
    if(ConfigLoader.get(`routesApi.global`)[route_name] === undefined) { return false }
    if(api !== undefined && ConfigLoader.get(`routesApi`)[`${api}.${route_name}`]) { return {...ConfigLoader.get(`routesApi`)[`${api}.${route_name}`], name: `${api}.${route_name}`} }

    return {...ConfigLoader.get(`routesApi.global`)[route_name], global : true, name: route_name}
}

export const ajaxFunctionsInternal = { showFlash, getRouteFromConfig }