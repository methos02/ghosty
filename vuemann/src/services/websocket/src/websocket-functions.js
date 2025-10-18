import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { flash } from "@brugmann/vuemann/src/services/services-helper.js"

const getRoute = route_name => {
    const route = websocketFunctionsInternal.getRouteFromConfig(route_name)
    if(typeof route === "string") { return flash.errorT(route, { route_name }) }
    return route
}

const generateUrlFromRoute = route_name => {
    const route = websocketFunctionsInternal.getRouteFromConfig(route_name)
    if(typeof route === "string") { return flash.errorT(route, { route_name }) }
    
    const api = ConfigLoader.get(`app.apis.${route.api}`)
    if(api === undefined) { return flash.errorT('ws_api_undefined', { api : route.api }) }

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


export const websocketFunctions = { getRoute , generateUrlFromRoute , getJsonFromData }

const getRouteFromConfig = route_name => {
    const route = ConfigLoader.get(`routesApi`, {})[route_name]

    if(route === undefined) { return 'ws_route_unknow' }
    if(route.api === undefined) { return 'ws_route_api_undefined' }
    if(route.url === undefined) { return 'ws_route_url_undefined' }

    return {...route, name: route_name }
}

export const websocketFunctionsInternal = { getRouteFromConfig }
