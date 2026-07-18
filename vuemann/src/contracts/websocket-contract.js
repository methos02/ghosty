/**
 * WebSocket contract
 * @typedef {Object} WebsocketService
 * @property {(routeName: string) => boolean | undefined} open
 * @property {(routeName: string) => string} close
 * @property {(routeName: string) => WebSocket | undefined} get
 * @property {(routeName: string) => boolean} exist
 * @property {(routeName: string, events: Array<{ event: string, callback: (payload: unknown) => unknown }>) => boolean | undefined} register
 * @property {() => void} clear
 * @property {(routeName: string) => void} clearQueue
 * @property {(routeName: string) => { event: string, payload: unknown } | undefined} lastEvent
 */
export {}
