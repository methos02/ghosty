import { ref } from 'vue'
import { APP_STATUS } from '@/constants/utils-constants.js'

const defaultLoadingSentence = 'app-component.loading'

const errorGlobal = ref()
const errorsGlobal = ref([])
const appStatus = ref(APP_STATUS.INIT)
const loadingSentence = ref(defaultLoadingSentence)

const setAppStatus = newStatus => {
  appStatus.value = newStatus
}

const getAppStatus = () => {
  return appStatus.value
}

const resetAppStatus = () => {
  appStatus.value = APP_STATUS.INIT
}

const setLoadingSentence = sentence => {
  loadingSentence.value = sentence
}

const getLoadingSentence = () => {
  return loadingSentence.value
}

const resetLoadingSentence = () => {
  loadingSentence.value = defaultLoadingSentence
}

const setAppError = error => {
  errorGlobal.value = error
}

const getAppError = () => {
  return errorGlobal.value
}

const resetAppError = () => {
  errorGlobal.value = undefined
}

export const utilsStore = {
  setAppStatus,
  getAppStatus,
  resetAppStatus,
  setLoadingSentence,
  getLoadingSentence,
  resetLoadingSentence,
  setAppError,
  getAppError,
  resetAppError,
}

export const useUtilsStore = () => ({
  errorGlobal,
  errorsGlobal,
  appStatus,
  loadingSentence,
  utilsStore,
})
