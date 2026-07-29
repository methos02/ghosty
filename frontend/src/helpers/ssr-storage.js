import { utilsH } from '@/helpers/utils-helper.js'

const hasLocalStorage = !utilsH.isSsr() && globalThis.localStorage !== undefined

const getItem = key => (hasLocalStorage ? localStorage.getItem(key) : undefined)

const setItem = (key, value) => {
  if (hasLocalStorage) {
    localStorage.setItem(key, value)
  }
}

const removeItem = key => {
  if (hasLocalStorage) {
    localStorage.removeItem(key)
  }
}

export const ssrStorage = {
  getItem,
  setItem,
  removeItem,
}
