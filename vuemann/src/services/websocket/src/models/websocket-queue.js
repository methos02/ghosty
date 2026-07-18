/* eslint-disable no-console */

import { flash, t, log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-event.js'
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-socket.js'
import { websocketFunctions } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js'
import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'
import { WsVisibility } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-visibility.js'
import { WsResync } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-resync.js'

const state = {
  messages: [],
  blockedMessages: {},
  lastEvent: {},
  isProcessing: false,
}

const getMessages = () => {
  return state.messages
}

const getLastEvent = routeApiName => state.lastEvent[routeApiName]

const clearQueue = routeApiName => {
  const toKeep = state.messages.filter(message => message.routeApiName !== routeApiName)
  state.messages.length = 0
  state.messages.push(...toKeep)
}

const wsOnMessage = async (routeApiName, message) => {
  state.messages.push({ routeApiName, message })

  if (state.isProcessing === true) {
    return
  }

  state.isProcessing = true
  await wsQueue.processMessages()
}

const processMessages = async () => {
  const triggersByRoute = new Map()

  while (state.messages.length > 0) {
    const message = state.messages.shift()
    if (triggersByRoute.has(message.routeApiName)) {
      continue
    }
    try {
      await wsQueue.processMessage(message.routeApiName, message.message)
    } catch (error) {
      console.error('Erreur lors du traitement du message WebSocket:', error)
      log.send('error queue ws', {
        messageWs: message,
        error: {
          message: error.message,
          name: error.name,
        },
      })
      triggersByRoute.set(
        message.routeApiName,
        wsQueueInternal.getEventFromMessage(message.message),
      )
    }
  }

  for (const [routeApiName, event] of triggersByRoute) {
    await WsResync.triggerResync(routeApiName, { type: 'event_error', event })
  }

  state.isProcessing = false
}

const handleWsTokenExpired = async routeApiName => {
  const route = websocketFunctions.getRoute(routeApiName)
  if (!route) {
    return false
  }

  // Create mock response that passes canRefreshToken() check
  const mockResponse = { status: STATUS.UNAUTHORIZED, data: { detail: 'expired' } }
  const response = await servicesM.service('auth:refreshToken', [route.api, mockResponse])

  if (response.status !== STATUS.SUCCESS) {
    servicesM.service('auth:logout')
    return false
  }

  Socket.softClose(routeApiName)
  Socket.open(routeApiName)
  return true
}

const isTokenExpiredError = parsedContent => {
  return parsedContent.error?.toLowerCase().includes('expired')
}

const isGlobalEvent = event => {
  return ['ping', 'connected'].includes(event)
}

const getEventFromMessage = message => {
  return websocketFunctions.getJsonFromData(message.data)?.event
}

const validateEventHandler = (routeApiName, event) => {
  if (!EventWs.hasRoute(routeApiName)) {
    flash.errorT('ws_event_no', { routeApiName })
    return false
  }
  if (!EventWs.hasEvent(routeApiName, event)) {
    flash.errorT('ws_event_unknow', { routeApiName, event })
    return false
  }
  return true
}

const addBlockedMessage = (routeApiName, parsedContent) => {
  state.blockedMessages[routeApiName] ??= []
  state.blockedMessages[routeApiName].push(parsedContent)
}

const processBlockedMessages = async routeApiName => {
  const messages = state.blockedMessages[routeApiName] || []
  for (const message of messages) {
    await EventWs.get(routeApiName, message.event)(message)
  }
  delete state.blockedMessages[routeApiName]
}

const clearBlockedMessages = routeApiName => {
  if (routeApiName) {
    delete state.blockedMessages[routeApiName]
    return
  }
  for (const key of Object.keys(state.blockedMessages)) {
    delete state.blockedMessages[key]
  }
}

const processMessage = async (routeApiName, message) => {
  const parsedContent = websocketFunctions.getJsonFromData(message.data)
  if (!parsedContent) {
    return flash.errorT('ws_data_bad', { data: message.data, routeApiName })
  }
  if (wsQueueInternal.isTokenExpiredError(parsedContent)) {
    return await handleWsTokenExpired(routeApiName)
  }
  if (!parsedContent.event) {
    return flash.errorT('ws_data_no_event', { routeApiName })
  }
  if (wsQueueInternal.isGlobalEvent(parsedContent.event)) {
    return console.log(t('ws_global_event', { event: parsedContent.event, routeApiName }))
  }
  if (!wsQueueInternal.validateEventHandler(routeApiName, parsedContent.event)) {
    return false
  }
  if (WsVisibility.shouldBlockProcessing(routeApiName)) {
    wsQueueInternal.addBlockedMessage(routeApiName, parsedContent)
    return false
  }

  await EventWs.get(routeApiName, parsedContent.event)(parsedContent)
  state.lastEvent[routeApiName] = { at: Date.now(), content: parsedContent }
  return true
}

export const wsQueue = {
  processMessages,
  processMessage,
  wsOnMessage,
  getMessages,
  getLastEvent,
  clearQueue,
  processBlockedMessages,
  clearBlockedMessages,
}

export const wsQueueInternal = {
  isTokenExpiredError,
  isGlobalEvent,
  getEventFromMessage,
  validateEventHandler,
  addBlockedMessage,
}
