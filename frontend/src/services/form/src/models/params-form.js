let rules = [];
let errors = {};
let tests = {};

const init = params => {
    rules = Array.isArray(params.rules) ? params.rules : params.rules.split('|')
    errors = params.errors ?? {}
    tests = params.tests ?? {}
}

const getRule = inputName => {
    if(inputName === undefined) { return rules }
    return rules[inputName]
}

const getError = (testName, errorKey) => {
    testName = getName(testName)
    if(testName === undefined) { return errors }
    return errors[testName] ?? errorKey
}

const getTest = testName => {
    if(testName === undefined) { return tests }
    return tests[testName]
}

const getName = test => {
    if (typeof test !== 'string') { return false }
    if (!test.includes(':')) { return test }
    const [test_name] = test.split(':')
    return test_name
}

export const paramsForm = { init, getRule, getError, getTest, getName }