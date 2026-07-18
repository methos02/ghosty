import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-event.js'

const state = {
  bannerHandler: undefined,
}

const setBannerHandler = handler => {
  state.bannerHandler = handler
}

const triggerResync = (routeApiName, trigger) => {
  if (!EventWs.hasRoute(routeApiName)) {
    return
  }
  if (!state.bannerHandler) {
    return
  }

  state.bannerHandler(routeApiName, trigger)
}

export const WsResync = {
  setBannerHandler,
  triggerResync,
}
