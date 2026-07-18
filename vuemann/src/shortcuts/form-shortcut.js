import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('form')

export const formStore = {
  // refs
  get errors() {
    return _store().errors
  },
  get options() {
    return _store().options
  },
  // methods
  get addError() {
    return _store().formStore.addError
  },
  get clearError() {
    return _store().formStore.clearError
  },
  get clearErrors() {
    return _store().formStore.clearErrors
  },
  get setOption() {
    return _store().formStore.setOption
  },
  get setOptions() {
    return _store().formStore.setOptions
  },
  get getOption() {
    return _store().formStore.getOption
  },
  get hasOption() {
    return _store().formStore.hasOption
  },
  get getOptions() {
    return _store().formStore.getOptions
  },
  get getErrors() {
    return _store().formStore.getErrors
  },
  get getError() {
    return _store().formStore.getError
  },
  get hasError() {
    return _store().formStore.hasError
  },
  get clearOptions() {
    return _store().formStore.clearOptions
  },
}

export const form = {
  addError: (inputName, error) => servicesM.service('form:addError', [inputName, error]),
  clearError: inputName => servicesM.service('form:clearError', [inputName]),
  clearErrors: () => servicesM.service('form:clearErrors'),
  getError: inputName => servicesM.service('form:getError', [inputName]),
  getErrors: () => servicesM.service('form:getErrors'),
  hasError: inputName => servicesM.service('form:hasError', [inputName]),
  validate: (rules, data, options = {}) =>
    servicesM.service('form:validateForm', [rules, data, options]),
}
