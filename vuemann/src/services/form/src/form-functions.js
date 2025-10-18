import { datasForm } from "@brugmann/vuemann/src/services/form/src/models/datas-form.js"
import { defaultTests } from "@brugmann/vuemann/src/services/form/src/default-tests-form.js"
import { formStore } from "@brugmann/vuemann/src/services/form/src/form-store.js"
import { paramsForm } from "@brugmann/vuemann/src/services/form/src/models/params-form.js"
import { FormHelper } from "@brugmann/vuemann/src/services/form/form-helper.js"

const executeGlobal = globalTests => {
  if (globalTests === undefined || formStore.hasError()) { return }

  for (const testGlobal of globalTests) {
    const result = testGlobal(datasForm.get())

    if (result !== '') {
      formStore.addError('global_tests', result)
      break
    }
  }
}

const executes = (input_name, value) => {
  const rules = paramsForm.getRule()
  
  for (const rule of rules) { 
    if (rule !== 'required' && FormHelper.isEmpty(value)) { continue }
    
    const test = paramsForm.getTest(rule)
    const result = test === undefined ? defaultTests.execute(rule, value, datasForm.get()) : test(value, datasForm.get())
    
    if (result !== '') {
    
      formStore.addError(input_name, paramsForm.getError(rule, result))
      break
    }
  }
}

const getName = test => {
    if (typeof test !== 'string') { return false }
    if (!test.includes(':')) { return test }
    const [test_name] = test.split(':')
    return test_name
}

export const FormFunctions = { getName, executes, executeGlobal }
