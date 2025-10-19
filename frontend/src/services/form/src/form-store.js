import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormStore = defineStore('form', () => {
  const errors = ref({})
  const options = ref({})
  
  return { errors, options }
})

let store
const get = () => {
  if(store === undefined) { store = useFormStore() }
  return store
}

const hasOption = optionName => {
  if(store === undefined) { store = useFormStore() }
  return store.options[optionName] !== undefined
}

const getOptions = () => {
  if(store === undefined) { store = useFormStore() }
  return store.options
}

const getOption = optionName => {
  if(store === undefined) { store = useFormStore() }
  return store.options[optionName]
}

const setOption = (optionName, optionValue) => {
  if(store === undefined) { store = useFormStore() }
  store.options[optionName] = optionValue
}

const clearOptions = () => {
  if(store === undefined) { store = useFormStore() }
  store.options = {}
}

const setOptions = options => {
  if(store === undefined) { store = useFormStore() }
  store.options = options
}

const hasError = inputName => {
  if(store === undefined) { store = useFormStore() }
  if(inputName === undefined) { return Object.keys(store.errors).length > 0 }
  
  return store.errors[inputName] !== undefined
}

const getErrors = () => {
  if(store === undefined) { store = useFormStore() }
  return store.errors
}

const getError = inputName => {
  if(store === undefined) { store = useFormStore() }
  return store.errors[inputName]
}

const addError = (inputName, errorKey) => {
  if(store === undefined) { store = useFormStore() }

  if(formStore.hasOption('form')) { inputName = `${formStore.getOption('form')}.${inputName}` }

  store.errors[inputName] = errorKey
}

const clearError = inputName => {
  if(store === undefined) { store = useFormStore() }
  delete store.errors[inputName]
}

const clearErrors = () => {  
  if(store === undefined) { store = useFormStore() }
  store.errors = {}
}

export const formStore = { 
  get, 
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
  clearOptions
}
