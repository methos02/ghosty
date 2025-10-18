import { formStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'
import { datasForm } from '@brugmann/vuemann/src/services/form/src/models/datas-form.js'
import { paramsForm } from '@brugmann/vuemann/src/services/form/src/models/params-form.js'
import { FormFunctions } from '@brugmann/vuemann/src/services/form/src/form-functions.js'

const validateForm = (params, current_datas, options = {}) => {
  datasForm.set(current_datas)
  formStore.clearErrors()
  formStore.setOptions(options)

  for (const [input_name, param_input] of Object.entries(params)) {
    if (input_name === 'global_tests') { continue }
    
    paramsForm.init(param_input)
    const value = param_input.format === undefined ? current_datas[input_name] : param_input.format(current_datas)
    FormFunctions.executes(input_name, value)
  }

  FormFunctions.executeGlobal(params['global_tests'])

  return { 
    valid: !formStore.hasError(), 
    datas: current_datas, 
    errors : formStore.getErrors() 
  }
}

export const formService = { 
  validateForm, 
  getErrors : formStore.getErrors, 
  getError : formStore.getError, 
  hasError : formStore.hasError,
  addError : formStore.addError,
  clearError : formStore.clearError,
  clearErrors : formStore.clearErrors,
}
