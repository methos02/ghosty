import { ref } from 'vue'

// État global (hors fonction = partagé entre tous les composants)
const errors = ref({})
const options = ref({})

// Fonction get() pour compatibilité avec l'ancien code
const get = () => {
  return {
    errors: errors.value,
    options: options.value
  }
}

const hasOption = (optionName) => {
  return options.value[optionName] !== undefined
}

const getOptions = () => {
  return options.value
}

const getOption = (optionName) => {
  return options.value[optionName]
}

const setOption = (optionName, optionValue) => {
  options.value[optionName] = optionValue
}

const clearOptions = () => {
  options.value = {}
}

const setOptions = (newOptions) => {
  options.value = newOptions
}

const hasError = (inputName) => {
  if (inputName === undefined) {
    return Object.keys(errors.value).length > 0
  }

  return errors.value[inputName] !== undefined
}

const getErrors = () => {
  return errors.value
}

const getError = (inputName) => {
  return errors.value[inputName]
}

const addError = (inputName, errorKey) => {
  let finalInputName = inputName

  if (hasOption('form')) {
    finalInputName = `${getOption('form')}.${inputName}`
  }

  errors.value[finalInputName] = errorKey
}

const addErrors = (errorsObject) => {
  Object.entries(errorsObject).forEach(([inputName, errorKey]) => {
    addError(inputName, errorKey)
  })
}

const clearError = (inputName) => {
  delete errors.value[inputName]
}

const clearErrors = () => {
  errors.value = {}
}

export const formStore = {
  get,
  addError,
  addErrors,
  clearError,
  clearErrors,
  setOption,
  setOptions,
  getOption,
  hasOption,
  getOptions,
  getErrors,
  getError,
  hasError,
  clearOptions
}
