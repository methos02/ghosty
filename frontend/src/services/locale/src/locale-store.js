import { ref, readonly } from 'vue'
import { ssrStorage } from '@/core/helpers/ssr-storage.js'

const currentLocale = ref('fr')

const get = () => {
  return currentLocale.value
}

const set = newLocale => {
  currentLocale.value = newLocale
  ssrStorage.setItem('locale', newLocale)
}

export const localeStore = {
  get,
  set,
}

export const useLocaleStore = () => ({
  currentRef: readonly(currentLocale),
  localeStore,
})
