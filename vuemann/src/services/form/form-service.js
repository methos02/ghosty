import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { datasForm } from '@brugmann/vuemann/src/services/form/src/models/datas-form.js'
import { paramsForm } from '@brugmann/vuemann/src/services/form/src/models/params-form.js'
import { FormFunctions } from '@brugmann/vuemann/src/services/form/src/form-functions.js'
import { FormHelper } from '@brugmann/vuemann/src/helpers/form-helper.js'

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

/** @type {import('@brugmann/vuemann/src/contracts/form-contract.js').FormService} */
export const formService = {
  addError: formStore.addError,
  clearError: formStore.clearError,
  clearErrors: formStore.clearErrors,
  getError: formStore.getError,
  getErrors: formStore.getErrors,
  hasError: formStore.hasError,
  validateForm,
}
