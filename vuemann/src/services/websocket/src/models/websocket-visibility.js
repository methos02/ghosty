import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-queue.js'
import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-event.js'
import { websocketStore } from '@brugmann/vuemann/src/services/websocket/src/websocket-store.js'

const state = {
  eventCounts: {},
  isTabHidden: false,
  isListeningVisibility: false,
}

const track = routeApiName => {
  if (!state.isListeningVisibility) {
    document.addEventListener('visibilitychange', WsVisibilityInternal.handleVisibilityChange)
    state.isListeningVisibility = true
  }
  state.eventCounts[routeApiName] = 0
}

const untrack = routeApiName => {
  delete state.eventCounts[routeApiName]

  if (Object.keys(state.eventCounts).length === 0 && state.isListeningVisibility) {
    document.removeEventListener('visibilitychange', WsVisibilityInternal.handleVisibilityChange)
    state.isListeningVisibility = false
  }
}

const shouldBlockProcessing = routeApiName => {
  if (!state.isTabHidden) {
    return false
  }
  if (!EventWs.hasRoute(routeApiName)) {
    return false
  }

  state.eventCounts[routeApiName] = (state.eventCounts[routeApiName] || 0) + 1
  return true
}

export const WsVisibility = {
  track,
  untrack,
  shouldBlockProcessing,
}

const resetEventCounts = () => {
  for (const key of Object.keys(state.eventCounts)) {
    state.eventCounts[key] = 0
  }
}

const handleVisibilityChange = async () => {
  if (document.hidden) {
    state.isTabHidden = true
    WsVisibilityInternal.resetEventCounts()
    wsQueue.clearBlockedMessages()
    return
  }

  state.isTabHidden = false

  let shouldReload = false
  for (const [routeApiName, count] of Object.entries(state.eventCounts)) {
    if (count <= 1) {
      await wsQueue.processBlockedMessages(routeApiName)
      continue
    }

    wsQueue.clearQueue(routeApiName)
    wsQueue.clearBlockedMessages(routeApiName)
    shouldReload = true
  }

  if (shouldReload) {
    websocketStore.reloadIfAllowed()
  }

  WsVisibilityInternal.resetEventCounts()
}

export const WsVisibilityInternal = {
  handleVisibilityChange,
  resetEventCounts,
}
