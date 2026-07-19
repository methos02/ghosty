import { flashPlugin } from '@/services/flash/src/flash-plugin.js'
import { useFlashStore } from '@/services/flash/src/flash-store.js'

export const flashInit = {
  dependencies: [],
  plugin: flashPlugin,
  store: useFlashStore(),
}
