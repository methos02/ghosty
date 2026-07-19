import { servicesM } from '@/services/services-manager.js'
import { servicesStores } from '@/services/services-stores.js'

const _store = () => servicesStores.get('utils')

export const utilsStore = {
  // refs
  get errorGlobal() {
    return _store().errorGlobal
  },
  get errorsGlobal() {
    return _store().errorsGlobal
  },
  get appStatus() {
    return _store().appStatus
  },
  get loadingSentence() {
    return _store().loadingSentence
  },
  // methods
  get setAppStatus() {
    return _store().utilsStore.setAppStatus
  },
  get getAppStatus() {
    return _store().utilsStore.getAppStatus
  },
  get setLoadingSentence() {
    return _store().utilsStore.setLoadingSentence
  },
  get getLoadingSentence() {
    return _store().utilsStore.getLoadingSentence
  },
  get resetLoadingSentence() {
    return _store().utilsStore.resetLoadingSentence
  },
  get setAppError() {
    return _store().utilsStore.setAppError
  },
  get getAppError() {
    return _store().utilsStore.getAppError
  },
}

export const utils = {
  hydrate: (data, keys, config = {}) => servicesM.service('utils:hydrate', [data, keys, config]),
  registerController: (name, controller) =>
    servicesM.service('utils:registerController', [name, controller]),
}
