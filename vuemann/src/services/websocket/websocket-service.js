import { EventWs } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-event.js'
import { Socket } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-socket.js'
import { wsQueue } from '@brugmann/vuemann/src/services/websocket/src/models/websocket-queue.js'

/** @type {import('@brugmann/vuemann/src/contracts/websocket-contract.js').WebsocketService} */
export const websocketService = {
  clear: EventWs.clear,
  clearQueue: wsQueue.clearQueue,
  close: Socket.close,
  exist: Socket.hasSocket,
  get: Socket.get,
  lastEvent: wsQueue.getLastEvent,
  open: Socket.open,
  register: EventWs.register,
}
