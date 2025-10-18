import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/event-ws.js'
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/socket.js'

export const websocketService = { 
    open : Socket.open, 
    close : Socket.close,
    get : Socket.get,
    exist : Socket.exist,
    register : EventWs.register, 
    registerPrevent: EventWs.registerPrevent,
    hasPrevent: EventWs.hasPrevent,
    getPrevent: EventWs.getPrevent,
} 
