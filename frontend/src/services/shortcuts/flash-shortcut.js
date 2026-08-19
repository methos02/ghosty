import { servicesM } from '@/services/services-manager.js'
import { servicesStores } from '@/services/services-stores.js'

const _store = () => servicesStores.get('flash')

export const flashStore = {
  get flashes() {
    return _store().flashes
  },
  get addFlash() {
    return _store().flashStore.addFlash
  },
  get removeFlash() {
    return _store().flashStore.removeFlash
  },
  get clearFlashes() {
    return _store().flashStore.clearFlashes
  },
  get getFlashes() {
    return _store().flashStore.getFlashes
  },
  get getFlash() {
    return _store().flashStore.getFlash
  },
  get hasFlash() {
    return _store().flashStore.hasFlash
  },
  get error() {
    return _store().flashStore.error
  },
  get success() {
    return _store().flashStore.success
  },
  get warning() {
    return _store().flashStore.warning
  },
}

export const flash = {
  get flashes() {
    return _store().flashes
  },
  get addFlash() {
    return _store().flashStore.addFlash
  },
  get removeFlash() {
    return _store().flashStore.removeFlash
  },
  get clearFlashes() {
    return _store().flashStore.clearFlashes
  },
  get getFlashes() {
    return _store().flashStore.getFlashes
  },
  get getFlash() {
    return _store().flashStore.getFlash
  },
  get hasFlash() {
    return _store().flashStore.hasFlash
  },
  error: message => {
    _store().flashStore.error(message)
    return false
  },
  errorT: (key, params) => {
    const message = servicesM.service('locale:t', [key, params])
    return flash.error(message)
  },
  success: message => {
    _store().flashStore.success(message)
  },
  successT: (key, params) => {
    const message = servicesM.service('locale:t', [key, params])
    flash.success(message)
  },
  warning: message => {
    _store().flashStore.warning(message)
  },
  warningT: (key, params) => {
    const message = servicesM.service('locale:t', [key, params])
    flash.warning(message)
  },
}
