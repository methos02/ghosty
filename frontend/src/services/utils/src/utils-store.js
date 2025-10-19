import { ref } from 'vue'
import { APP_STATUS } from '@/services/utils/utils-constants.js'

// État global (hors fonction = partagé entre tous les composants)
const instances = ref({})
const errorGlobal = ref()
const errorsGlobal = ref([])
const needUpdate = ref(false)
const appStatus = ref(APP_STATUS.LOADING)

// Fonction get() pour compatibilité avec l'ancien code
const get = () => {
  return {
    instances: instances.value,
    errorGlobal: errorGlobal.value,
    errorsGlobal: errorsGlobal.value,
    needUpdate: needUpdate.value,
    appStatus: appStatus.value
  }
}

const setAppStatus = (newStatus) => {
  appStatus.value = newStatus
}

const getAppStatus = () => {
  return appStatus.value
}

const setErrorGlobal = (error) => {
  errorGlobal.value = error
}

const addErrorGlobal = (error) => {
  errorsGlobal.value.push(error)
}

const clearErrorsGlobal = () => {
  errorsGlobal.value = []
}

const setNeedUpdate = (value) => {
  needUpdate.value = value
}

const setInstance = (key, instance) => {
  instances.value[key] = instance
}

const getInstance = (key) => {
  return instances.value[key]
}

const hasInstance = (key) => {
  return instances.value[key] !== undefined
}

export const utilsStore = {
  get,
  setAppStatus,
  getAppStatus,
  setErrorGlobal,
  addErrorGlobal,
  clearErrorsGlobal,
  setNeedUpdate,
  setInstance,
  getInstance,
  hasInstance
}
