import { ref } from 'vue'
import { flashFunctions } from '@/services/flash/src/flash-functions.js'
import { UTILS } from '@/constants/utils-constants.js'

const flashes = ref([])
const autoDelete = 4000

const getFlashIndex = flash_id => {
  return flashes.value.findIndex(flash => flash.id === flash_id)
}

const autoRemoveFlash = flash => {
  setTimeout(() => {
    flash.autodelete ? removeFlash(flash.id) : autoRemoveFlash(flash)
  }, autoDelete)
}

const removeFlash = flash_id => {
  const flash_index = getFlashIndex(flash_id)
  if (flash_index === UTILS.FIND_NOT_FOUND) {
    return
  }

  flashes.value[flash_index].hide = true
  const DELAY_MS = 350
  setTimeout(() => flashes.value.splice(flash_index, 1), DELAY_MS)
}

const addFlash = (content, type = 'error') => {
  const flash_id = flashFunctions.generateFlashId()
  flashes.value.push({
    content,
    type,
    id: flash_id,
    autodelete: true,
  })

  const flash_index = getFlashIndex(flash_id)
  if (flash_index === UTILS.FIND_NOT_FOUND) {
    return
  }

  autoRemoveFlash(flashes.value[flash_index])
}

const error = message => {
  addFlash(message, 'error')
  return false
}

const success = message => {
  addFlash(message, 'success')
}

const warning = message => {
  addFlash(message, 'warning')
}

const getFlashes = () => {
  return flashes.value
}

const getFlash = flash_id => {
  const flash_index = getFlashIndex(flash_id)
  if (flash_index === UTILS.FIND_NOT_FOUND) {
    return void 0
  }
  return flashes.value[flash_index]
}

const hasFlash = flash_id => {
  return getFlashIndex(flash_id) !== UTILS.FIND_NOT_FOUND
}

const clearFlashes = () => {
  flashes.value = []
}

export const flashStore = {
  error,
  success,
  warning,
  getFlashes,
  getFlash,
  hasFlash,
  addFlash,
  removeFlash,
  clearFlashes,
}

export const useFlashStore = () => ({
  flashes,
  flashStore,
})
