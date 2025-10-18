/* eslint-disable no-console */

import { websocketFunctions } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js'
import { flash, t } from "@brugmann/vuemann/src/services/services-helper.js"
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js'
import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/ws-queue.js'

const sockets = {}
const reconnectionIntervals = {}
const manualClosures = {}

const open = route_name => {
    if( ConfigLoader.get('app.ws') === "false") { return false }

    const route = websocketFunctions.getRoute(route_name)
    if(!route) { return false }

    if(Socket.isActive(route_name)) { return flash.errorT('ws_route_already_exist') }
    
    sockets[route_name] = new WebSocket(websocketFunctions.generateUrlFromRoute(route_name));

    sockets[route_name].addEventListener('open', () => SocketInternal.wsOnOpen(route))
    sockets[route_name].addEventListener('message', async (message) => await wsQueue.wsOnMessage(route_name, message))
    sockets[route_name].addEventListener('close', () => SocketInternal.wsOnClose(route_name))
    
    sockets[route_name].name = route_name

    return true
}

const close = route_name => {
    if(reconnectionIntervals[route_name] !== undefined) { SocketInternal.stopReconnection(route_name) }
    
    EventWs.deleteRouteEvents(route_name)

    if (sockets[route_name] === undefined) { return 'close_partial' }
    
    manualClosures[route_name] = true
    sockets[route_name].close()

    return 'close_totaly'
}

const get =  route_name => {
    return route_name === undefined ? sockets : sockets[route_name]
}

const exist = route_name => {
    return sockets[route_name] !== undefined
}

const isActive = route_name => {
    if(!Socket.exist(route_name)) { return false }
    return [WebSocket.CONNECTING, WebSocket.OPEN].includes(sockets[route_name].readyState)
}

export const Socket = { get, exist, close, open, isActive }

const wsOnOpen = route => {
    sockets[route.name].send(JSON.stringify({type: "auth", token: 'Bearer ' + servicesM.service('auth:getAccessToken', route.api) }))
    
    SocketInternal.stopReconnection(route.name)
    console.log(t('ws_open', {route_name : route.name}));
}

const wsOnClose = route_name => {
    console.log(t('ws_close', {route_name}))
    delete sockets[route_name]
    
    if(manualClosures[route_name] === true) { 
        delete manualClosures[route_name]
        return 
    }

    SocketInternal.startReconnection(route_name)
}

const RECONNECTION_INTERVAL = 1000
const startReconnection = route_name => {
    if (reconnectionIntervals[route_name]) { return }

    reconnectionIntervals[route_name] = setInterval(() => {
        if (Socket.isActive(route_name) || manualClosures[route_name]) { 
            SocketInternal.stopReconnection(route_name); 
            return
        }
        
        console.log(t('ws_reconnect_attempt', {route_name}))
        
        Socket.open(route_name)
   
    }, RECONNECTION_INTERVAL)
}

const stopReconnection = route_name => {
    if (reconnectionIntervals[route_name] === undefined) { return }

    clearInterval(reconnectionIntervals[route_name])
    delete reconnectionIntervals[route_name]
    
    console.log(t('ws_reconnection_stopped', {route_name}))    
}

export const SocketInternal = { wsOnOpen, wsOnClose, startReconnection, stopReconnection }
