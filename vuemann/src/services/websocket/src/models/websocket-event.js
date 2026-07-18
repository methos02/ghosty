import { flash } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-socket.js'
import { WsVisibility } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-visibility.js'

const state = {
  events: {},
}

const get = (routeApiName, eventName) => {
  return state.events[routeApiName][eventName]
}

const register = (routeApiName, events) => {
  if (!Socket.hasSocket(routeApiName) && !Socket.open(routeApiName)) {
    return false
  }

  if (!EventWs.hasRoute(routeApiName)) {
    state.events[routeApiName] = {}
  }
  for (const { event, callback } of events) {
    if (EventWs.hasEvent(routeApiName, event) === true) {
      flash.errorT('ws_event_already_exist', { event })
      continue
    }
    state.events[routeApiName][event] = callback
  }

  WsVisibility.track(routeApiName)
  return true
}

const hasEvent = (routeApiName, eventName) => {
  return (
    state.events[routeApiName] !== undefined && state.events[routeApiName][eventName] !== undefined
  )
}

const hasRoute = routeApiName => {
  return state.events[routeApiName] !== undefined
}

const deleteRouteEvents = routeApiName => {
  delete state.events[routeApiName]
}

const clear = () => {
  state.events = {}
}

export const EventWs = {
  hasEvent,
  hasRoute,
  register,
  deleteRouteEvents,
  get,
  clear,
}
