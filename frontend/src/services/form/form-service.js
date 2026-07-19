import { formStore } from '@/services/form/src/form-store.js'
import { datasForm } from '@/services/form/src/models/datas-form.js'
import { paramsForm } from '@/services/form/src/models/params-form.js'
import { FormFunctions } from '@/services/form/src/form-functions.js'
import { FormHelper } from '@/helpers/form-helper.js'

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

// Custom Ghosty : mappe les erreurs de validation Laravel (champ backend -> champ frontend)
const mapFields = (validationErrors, mapping) => {
  const mapped = {}
  for (const [field, message] of Object.entries(validationErrors)) {
    const frontendField = mapping[field] ?? field
    mapped[frontendField] = message
  }
  return mapped
}

export const formService = {
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
