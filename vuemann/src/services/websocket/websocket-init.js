import { websocketService } from '@brugmann/vuemann/src/services/websocket/websocket-service.js'
import { websocketPlugin } from '@brugmann/vuemann/src/services/websocket/src/websocket-plugin.js'
import { useWebsocketStore } from '@brugmann/vuemann/src/services/websocket/src/websocket-store.js'

export const websocketInit = {
  dependencies: ['auth', 'flash', 'locale', 'log', 'router'],
  services: websocketService,
  plugin: websocketPlugin,
  store: useWebsocketStore(),
  vuemann: true,
}
