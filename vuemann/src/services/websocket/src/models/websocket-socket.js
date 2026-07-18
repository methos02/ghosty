/* eslint-disable no-console */

import { websocketFunctions } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js'
import { flash, t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-event.js'
import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-queue.js'
import { WsResync } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-resync.js'
import { WsVisibility } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-visibility.js'

const state = {
  sockets: {},
  reconnectionTimers: {},
  reconnectionAttempts: {},
  manualClosures: {},
  socketIdCounter: 0,
}

const open = routeApiName => {
  if (ConfigLoader.find('app.ws') === 'false') {
    return false
  }

  const route = websocketFunctions.getRoute(routeApiName)
  if (!route) {
    return false
  }

  if (Socket.isActive(routeApiName)) {
    return flash.errorT('ws_route_already_exist')
  }

  const socketId = ++state.socketIdCounter
  state.sockets[routeApiName] = new WebSocket(websocketFunctions.generateUrlFromRoute(routeApiName))
  state.sockets[routeApiName]._id = socketId

  state.sockets[routeApiName].addEventListener('open', () => SocketInternal.wsOnOpen(route))
  state.sockets[routeApiName].addEventListener(
    'message',
    async message => await wsQueue.wsOnMessage(routeApiName, message),
  )
  state.sockets[routeApiName].addEventListener('close', () =>
    SocketInternal.wsOnClose(routeApiName, socketId),
  )

  state.sockets[routeApiName].name = routeApiName

  return true
}

const close = routeApiName => {
  if (state.reconnectionTimers[routeApiName] !== undefined) {
    SocketInternal.stopReconnection(routeApiName)
  }

  EventWs.deleteRouteEvents(routeApiName)
  WsVisibility.untrack(routeApiName)

  if (state.sockets[routeApiName] === undefined) {
    return 'close_partial'
  }

  state.manualClosures[routeApiName] = true
  state.sockets[routeApiName].close()

  return 'close_totaly'
}

const get = routeApiName => {
  return routeApiName === undefined ? state.sockets : state.sockets[routeApiName]
}

const hasSocket = routeApiName => {
  return state.sockets[routeApiName] !== undefined
}

const isActive = routeApiName => {
  if (!Socket.hasSocket(routeApiName)) {
    return false
  }
  return [WebSocket.CONNECTING, WebSocket.OPEN].includes(state.sockets[routeApiName].readyState)
}

const softClose = routeApiName => {
  if (state.reconnectionTimers[routeApiName] !== undefined) {
    SocketInternal.stopReconnection(routeApiName)
  }

  if (state.sockets[routeApiName] === undefined) {
    return
  }

  state.manualClosures[routeApiName] = true
  state.sockets[routeApiName].close()
}

export const Socket = {
  get,
  hasSocket,
  close,
  open,
  isActive,
  softClose,
}

const wsOnOpen = route => {
  const socket = state.sockets[route.name]
  if (!socket) {
    return
  }

  const wasReconnecting = state.reconnectionTimers[route.name] !== undefined

  SocketInternal.stopReconnection(route.name)
  socket.send(
    JSON.stringify({
      type: 'auth',
      token: 'Bearer ' + servicesM.service('auth:getAccessToken', route.api),
    }),
  )
  console.log(t('ws_open', { routeApiName: route.name }))

  if (wasReconnecting) {
    WsResync.triggerResync(route.name, { type: 'reconnect' })
  }
}

const wsOnClose = (routeApiName, socketId) => {
  const socket = state.sockets[routeApiName]
  if (socket && socket._id !== socketId) {
    return
  }

  console.log(t('ws_close', { routeApiName }))
  delete state.sockets[routeApiName]

  if (state.manualClosures[routeApiName] === true) {
    delete state.manualClosures[routeApiName]
    return
  }

  SocketInternal.startReconnection(routeApiName)
}

const RECONNECTION_BASE_DELAY = 1000
const RECONNECTION_MAX_DELAY = 30_000
const RECONNECTION_FACTOR = 2

const startReconnection = routeApiName => {
  if (state.reconnectionTimers[routeApiName] !== undefined) {
    return
  }

  state.reconnectionAttempts[routeApiName] = 0
  SocketInternal.scheduleReconnection(routeApiName)
}

const scheduleReconnection = routeApiName => {
  const delay = SocketInternal.computeDelay(state.reconnectionAttempts[routeApiName])
  state.reconnectionTimers[routeApiName] = setTimeout(
    () => SocketInternal.attemptReconnection(routeApiName),
    delay,
  )
}

const attemptReconnection = routeApiName => {
  delete state.reconnectionTimers[routeApiName]

  if (Socket.isActive(routeApiName) || state.manualClosures[routeApiName] === true) {
    SocketInternal.stopReconnection(routeApiName)
    return
  }

  state.reconnectionAttempts[routeApiName] += 1
  console.log(t('ws_reconnect_attempt', { routeApiName }))
  Socket.open(routeApiName)
  SocketInternal.scheduleReconnection(routeApiName)
}

const computeDelay = attempt => {
  const capped = Math.min(
    RECONNECTION_BASE_DELAY * RECONNECTION_FACTOR ** attempt,
    RECONNECTION_MAX_DELAY,
  )
  const half = capped / RECONNECTION_FACTOR
  return half + Math.random() * half
}

const stopReconnection = routeApiName => {
  if (state.reconnectionTimers[routeApiName] === undefined) {
    return
  }

  clearTimeout(state.reconnectionTimers[routeApiName])
  delete state.reconnectionTimers[routeApiName]
  delete state.reconnectionAttempts[routeApiName]

  console.log(t('ws_reconnection_stopped', { routeApiName }))
}

export const SocketInternal = {
  wsOnOpen,
  wsOnClose,
  startReconnection,
  scheduleReconnection,
  attemptReconnection,
  computeDelay,
  stopReconnection,
}
