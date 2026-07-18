import { ref } from 'vue'

const errors = ref({})
const options = ref({})

const hasOption = optionName => {
  return options.value[optionName] !== undefined
}

const getOptions = () => {
  return options.value
}

const getOption = optionName => {
  return options.value[optionName]
}

const setOption = (optionName, optionValue) => {
  options.value[optionName] = optionValue
}

const clearOptions = () => {
  options.value = {}
}

const setOptions = newOptions => {
  options.value = newOptions
}

const hasError = inputName => {
  if (inputName === undefined) {
    return Object.keys(errors.value).length > 0
  }

  return errors.value[inputName] !== undefined
}

const getErrors = () => {
  return errors.value
}

const getError = inputName => {
  return errors.value[inputName]
}

const addError = (inputName, errorKey) => {
  if (formStore.hasOption('form')) {
    inputName = `${formStore.getOption('form')}.${inputName}`
  }

  errors.value[inputName] = errorKey
}

const clearError = inputName => {
  delete errors.value[inputName]
}

const clearErrors = () => {
  errors.value = {}
}

export const formStore = {
  addError,
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
  clearOptions,
}

export const useFormStore = () => ({
  errors,
  options,
  formStore,
})
