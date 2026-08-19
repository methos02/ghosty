const getInputName = (inputName, formName) => {
  return formName === undefined ? inputName : `${formName}.${inputName}`
}

const isEmpty = value => {
  if (FormHelper.isEmptyArray(value)) {
    return true
  }
  if (FormHelper.isEmptyObject(value)) {
    return true
  }

  return FormHelper.isBlank(value)
}

const isBlank = value => {
  if (value === undefined || value === null) {
    return true
  }
  return value === ''
}

const isEmptyArray = value => {
  return Array.isArray(value) && value.length === 0
}

const isEmptyObject = value => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
}

export const FormHelper = {
  getInputName,
  isEmpty,
  isBlank,
  isEmptyArray,
  isEmptyObject,
}
