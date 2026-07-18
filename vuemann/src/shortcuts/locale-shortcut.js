import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('locale')

export const localeStore = {
  get currentRef() {
    return _store().currentRef
  },
  get get() {
    return _store().localeStore.get
  },
  get set() {
    return _store().localeStore.set
  },
}

export const locale = {
  current: () => servicesM.service('locale:getCurrentLocale'),
  t: (textKey, params = {}) => servicesM.service('locale:t', [textKey, params]),
}

export const t = (textKey, params = {}) => locale.t(textKey, params)
