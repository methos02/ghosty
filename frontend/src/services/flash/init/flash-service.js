import { useFlashStore } from '@/services/flash/src/flash-store.js'

export const error = message => {
  const flashStore = useFlashStore()
  flashStore.addMessage(message, 'error')
  // eslint-disable-next-line no-console
  console.error(message)
  return false
}

export const success = message => {
  const flashStore = useFlashStore()
  flashStore.addMessage(message, 'success')
}

export const warning = message => {
  const flashStore = useFlashStore()
  flashStore.addMessage(message, 'warning')
}

export const flashService = { error, success, warning }
