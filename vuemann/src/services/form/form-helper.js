const getInputName = (input_name, form_name) => {
  return form_name === undefined ? input_name : `${form_name}.${input_name}`
}

const isEmpty = (value) => {
  return value === '' || value === null || value === undefined
}

export const FormHelper = { getInputName, isEmpty }

