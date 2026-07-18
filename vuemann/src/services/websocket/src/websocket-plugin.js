import Resync from '@brugmann/vuemann/src/services/websocket/views/ResyncBannerComponent.vue'
import { websocketStore } from '@brugmann/vuemann/src/services/websocket/src/websocket-store.js'
import { WsResync } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-resync.js'
import { h, render } from 'vue'

export const websocketPlugin = () => ({
  install() {
    WsResync.setBannerHandler(websocketStore.request)

    const container = document.createElement('div')
    document.body.append(container)
    render(h(Resync), container)
  },
})
