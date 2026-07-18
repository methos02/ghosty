import { ref } from 'vue'
import { APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js'

const defaultLoadingSentence = 'app-component.loading'

const errorGlobal = ref()
const errorsGlobal = ref([])
const needUpdate = ref(false)
const appStatus = ref(APP_STATUS.INIT)
const loadingSentence = ref(defaultLoadingSentence)

const setAppStatus = newStatus => {
  appStatus.value = newStatus
}

const getAppStatus = () => {
  return appStatus.value
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

export const utilsStore = {
  setAppStatus,
  getAppStatus,
  setLoadingSentence,
  getLoadingSentence,
  resetLoadingSentence,
  setAppError,
  getAppError,
}

export const useUtilsStore = () => ({
  errorGlobal,
  errorsGlobal,
  needUpdate,
  appStatus,
  loadingSentence,
  utilsStore,
})
