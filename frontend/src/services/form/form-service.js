import { formStore } from '@/services/form/src/form-store.js'
import { datasForm } from '@/services/form/src/models/datas-form.js'
import { paramsForm } from '@/services/form/src/models/params-form.js'
import { FormFunctions } from '@/services/form/src/form-functions.js'
import { FormHelper } from '@/core/helpers/form-helper.js'

const validateForm = (params, currentDatas, options = {}) => {
  datasForm.set(currentDatas)
  formStore.clearErrors()
  formStore.setOptions(options)

  for (const [inputName, inputParam] of Object.entries(params)) {
    if (inputName === 'global_tests') {
      continue
    }
    if (FormHelper.isEmpty(inputParam)) {
      throw new Error(`InputName can't be empty`)
    }

    paramsForm.init(inputParam)
    const value =
      inputParam.format === undefined ? currentDatas[inputName] : inputParam.format(currentDatas)
    FormFunctions.executes(inputName, value)
  }

  FormFunctions.executeGlobal(params['global_tests'])

  return {
    valid: !formStore.hasError(),
    datas: currentDatas,
    errors: formStore.getErrors(),
  }
}

const mapFields = (validationErrors, mapping) => {
  const mapped = {}
  for (const [field, message] of Object.entries(validationErrors)) {
    const frontendField = mapping[field] ?? field
    mapped[frontendField] = Array.isArray(message) ? message[0] : message
  }
  return mapped
}

const addValidationErrors = (validationErrors, formName) => {
  const mapping = {}

  for (const field of Object.keys(validationErrors)) {
    mapping[field] = formServiceInternal.toInputName(field, formName)
  }

  formStore.clearOptions()
  formStore.addErrors(mapFields(validationErrors, mapping))
}

export const formService = {
  addValidationErrors,
  addError: formStore.addError,
  addErrors: formStore.addErrors,
  clearError: formStore.clearError,
  clearErrors: formStore.clearErrors,
  getError: formStore.getError,
  getErrors: formStore.getErrors,
  hasError: formStore.hasError,
  mapFields,
  validateForm,
}

const toInputName = (field, formName) => {
  const [prefix, ...rest] = field.split('.')
  const isScoped = rest.length > 0
  const scope = isScoped ? prefix : formName
  const name = isScoped ? rest.join('.') : field

  return `${scope}.${name.replaceAll(/_(\w)/g, (_, letter) => letter.toUpperCase())}`
}

export const formServiceInternal = { toInputName }
