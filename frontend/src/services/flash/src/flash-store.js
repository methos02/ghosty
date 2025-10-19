import { ref } from 'vue'
import { flashFunctions } from './flash-functions.js'
import { UTILS } from '../../utils/utils-constants.js'

// État global (hors fonction = partagé entre tous les composants)
const flashes = ref([])
const autoDelete = 4000

const getFlashIndex = (flash_id) => {
  return flashes.value.findIndex(flash => flash.id === flash_id)
}

const removeFlash = (flash_id) => {
  const flash_index = getFlashIndex(flash_id)
  if (flash_index === UTILS.FIND_NOT_FOUND) return

  flashes.value[flash_index].hide = true
  const DELAY_MS = 350
  setTimeout(() => flashes.value.splice(flash_index, 1), DELAY_MS)
}

const autoRemoveFlash = (flash) => {
  setTimeout(() => {
    if (flash.autodelete) {
      removeFlash(flash.id)
    } else {
      autoRemoveFlash(flash)
    }
  }, autoDelete)
}

const addMessage = (content, type = 'error') => {
  const flash_id = flashFunctions.generateFlashId()
  flashes.value.push({ content, type, id: flash_id, autodelete: true })

  const flash_index = getFlashIndex(flash_id)
  if (flash_index === UTILS.FIND_NOT_FOUND) return

  autoRemoveFlash(flashes.value[flash_index])
}

// Fonction get() pour compatibilité avec l'ancien code
const get = () => {
  return {
    flashes: flashes.value
  }
}

export const flashStore = {
  get,
  addMessage,
  removeFlash,
  flashes
}
