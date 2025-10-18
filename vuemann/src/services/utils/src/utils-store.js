import { defineStore } from 'pinia'
import { ref } from 'vue'
import { APP_STATUS } from '@brugmann/vuemann/src/services/utils/utils-constants.js'

export const useUtilsStore = defineStore('utils', () => {
  const instances = ref({})
  const errorGlobal = ref()
  const errorsGlobal = ref([])
  const needUpdate = ref(false)
  const appStatus = ref(APP_STATUS.LOADING)

  return { 
    instances, 
    errorGlobal, 
    errorsGlobal, 
    needUpdate, 
    appStatus, 
  }
})

let store
const get = () => {
  if(store === undefined) { store = useUtilsStore() }
  return store
}

const setAppStatus = (newStatus) => {
  utilsStore.get().appStatus = newStatus
}

const getAppStatus = () => {
  return utilsStore.get().appStatus
}

export const utilsStore = { 
  get, 
  setAppStatus, 
  getAppStatus 
}
