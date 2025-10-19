import { defineStore } from 'pinia'
import { ref } from 'vue'
import { flashFunctions } from './flash-functions.js'
import { UTILS } from '../../utils/utils-constants.js'

export const useFlashStore = defineStore('flash', () => {
  const flashes = ref([])
  const autoDelete = 4000

  const addMessage = (content, type = 'error') => {
    const flash_id = flashFunctions.generateFlashId()
    flashes.value.push({ content, type, id: flash_id, autodelete: true })

    const flash_index = getFlashIndex(flash_id)
    if (flash_index === UTILS.FIND_NOT_FOUND) { return }

    autoRemoveFlash(flashes.value[flash_index])
  }

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
    if (flash_index === UTILS.FIND_NOT_FOUND) { return }

    flashes.value[flash_index].hide = true
    const DELAY_MS = 350
    setTimeout(() => flashes.value.splice(flash_index, 1), DELAY_MS)
  }

  return { flashes, addMessage, removeFlash }
})
