import { ref, readonly } from 'vue'

const currentLocale = ref('fr')

const get = () => {
  return currentLocale.value
}

const set = newLocale => {
  currentLocale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

export const localeStore = {
  get,
  set,
}

export const useLocaleStore = () => ({
  currentRef: readonly(currentLocale),
  localeStore,
})
