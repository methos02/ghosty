import { getRouter } from "@/services/router/init/router-plugin.js";
import { routerStore } from "@/services/router/src/router-store.js";
import { flash } from "@/services/services-helper.js";
import { ConfigLoader } from "@/config/config-loader.js";

const hasApiRoute = route_name   => {
    return ConfigLoader.get(`routesApi.${route_name}`) !== undefined
}

const hasRoute = route_name => {
    return getRouter().hasRoute(route_name)
}

const addRoute = route => {
    if(route.path === undefined) { return flash.errorT('error_route_path') }
    if(route.component === undefined){ return flash.errorT('error_route_component', {url : route.path}) }
    
    getRouter().addRoute(route)
    return true
}

const currentRoute = () => {
    return getRouter().currentRoute
}

const getCurrentRouteParam = param_name => {
    const currentRoute = routerService.currentRoute().value
    return currentRoute.params[param_name] ?? currentRoute.query[param_name]
}

const hasCurrentRouteParam = param_name => {
    const currentRoute = routerService.currentRoute().value
    return param_name in currentRoute.params || param_name in currentRoute.query
}

const getRoute = routeName => {
    return getRouter().resolve({name: routeName})
}

const getRoutes = () => {
    return getRouter().getRoutes()
}

const push = async route => {
    if(typeof route === 'string') {
        await getRouter().push(route)
        return true
    }

    if(route.name !== undefined && !getRouter().hasRoute(route.name)) { return flash.errorT('error_route_unknown', { route_name : route.name }) }
    if(route.name === undefined && !getRouter().getRoutes().some(routeConfig => routeConfig.path === route)) { return flash.errorT('error_url_unknown', { url : route }) }
    
    await getRouter().push(route)
    return true
}

const redirectAfterLogin = async () => {
    const { urlIntented } = routerStore.get()
    await routerService.push(urlIntented)
    routerStore.setUrlIntented('/')
}

export const routerService = {
    hasApiRoute,
    hasRoute,
    addRoute,
    redirectAfterLogin,
    push,
    currentRoute,
    getCurrentRouteParam,
    hasCurrentRouteParam,
    getRoute,
    getRoutes,
}
