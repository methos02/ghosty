import { FormHelper } from '@/core/helpers/form-helper.js'

const state = {
  rules: [],
  errors: {},
  tests: {},
}

const init = params => {
  state.rules = Array.isArray(params.rules)
    ? params.rules
    : params.rules.split('|').filter(rule => rule !== '')
  state.errors = params.errors ?? {}
  state.tests = params.tests ?? {}
}

const getRule = inputName => {
  if (inputName === undefined) {
    return state.rules
  }
  return state.rules[inputName]
}

const getError = (testName, errorKey) => {
  testName = getName(testName)
  if (testName === undefined) {
    return state.errors
  }

  const error = state.errors[testName] ?? errorKey
  if (FormHelper.isEmpty(error)) {
    throw new Error(`Error key ${testName} is required`)
  }

  return error
}

const getTest = testName => {
  if (testName === undefined) {
    return state.tests
  }
  return state.tests[testName]
}

const getName = test => {
  if (typeof test !== 'string') {
    return false
  }
  if (!test.includes(':')) {
    return test
  }
  const [test_name] = test.split(':', 1)
  return test_name
}

export const paramsForm = {
  init,
  getRule,
  getError,
  getTest,
  getName,
}
