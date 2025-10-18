import { flash } from "@brugmann/vuemann/src/services/services-helper.js"
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"

const init = route => {
    const links = []
    if(route.meta.breadcrumb === undefined) { return links }

    for( const routeMatched of route.matched) {
        if(routeMatched.meta.breadcrumb === undefined) { return links }

        if(route.meta.breadcrumb.label === routeMatched.meta.breadcrumb.label) {
            links.push({ label : route.meta.breadcrumb.label })
            return links
        }

        if(route.meta.breadcrumb.parents !== undefined) { return breadcrumb.resolveParents(route.meta.breadcrumb.parents, links) }
        
        links.push({...routeMatched.meta.breadcrumb, route: {name: routeMatched.meta.breadcrumb.route}})
    }

    return links
}

const resolveParents = (parents, links) => {
    if(!Array.isArray(parents) || parents.length === 0) { return flash.errorT('breadcrumb.errors.parents') }
    
    for( const parent of parents) {
        const route = servicesM.service('router:getRoute', parent.route)
        if(route === undefined) { return flash.errorT('breadcrumb.errors.route_unknown', {route_name : parent.route}) }

        links.push({label: parent.label, route: {name: route.name}})
    }

    return links
}

export const breadcrumb = { init, resolveParents }
