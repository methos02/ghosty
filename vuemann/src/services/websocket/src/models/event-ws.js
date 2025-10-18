import { flash } from "@brugmann/vuemann/src/services/services-helper.js"
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js'
import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'

const events = {}
const prevents = {}

const get = (route_name, event_name) => {
    return events[route_name][event_name]
}

const register = (route_name, event, callBack) => {
    if(EventWs.exist(route_name, event) === true) { return flash.errorT('ws_event_already_exist') }

    if(!Socket.exist(route_name) && !Socket.open(route_name)) { return false }

    if(!EventWs.routeExist(route_name)) { events[route_name] = {} }
    events[route_name][event] = callBack

    return true
}

const registerPrevent = (route_name, event, datas) => {
    if(prevents[route_name] === undefined) { prevents[route_name] = {} }
    prevents[route_name][event] = datas
}

const prevent = (route_name, event, event_datas) => {
    if(!EventWs.hasPrevent(route_name, event)) { return false }

    const shouldPrevent = Object
    .keys(prevents[route_name][event])
    .every(key =>{ 
        return key in event_datas && utilsH.isRecursivelyIncluded(prevents[route_name][event][key], event_datas[key])
    });

    if(shouldPrevent) { delete prevents[route_name][event] }

    return shouldPrevent
}

const hasPrevent = (route_name, event) => {
    return prevents[route_name] !== undefined && prevents[route_name][event] !== undefined
}

const getPrevent = (route_name, event) => {    
    return hasPrevent(route_name, event) ? prevents[route_name][event] : undefined
}

const exist = (route_name, event_name) => {
    return events[route_name] !== undefined && events[route_name][event_name] !== undefined
}

const routeExist = route_name => {
    return events[route_name] !== undefined
}

const deleteRouteEvents = route_name => {
    delete events[route_name]
}

export const EventWs = { exist, routeExist, register, registerPrevent, deleteRouteEvents, get, prevent, hasPrevent, getPrevent }
