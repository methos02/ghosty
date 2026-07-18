import { flashPlugin } from '@brugmann/vuemann/src/services/flash/src/flash-plugin.js'
import { useFlashStore } from '@brugmann/vuemann/src/services/flash/src/flash-store.js'

export const flashInit = {
  dependencies: [],
  plugin: flashPlugin,
  store: useFlashStore(),
  vuemann: true,
}
