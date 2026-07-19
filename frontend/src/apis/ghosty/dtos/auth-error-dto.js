import { form } from '@/services/shortcuts/services-shortcut.js'

const registerFields = (validationErrors) => {
  return form.mapFields(validationErrors, {
    'pseudo': 'pseudo',
    'email': 'email',
    'password': 'password',
    'password_confirmation': 'passwordConfirmation'
  })
}

const loginFields = (validationErrors) => {
  return form.mapFields(validationErrors, {
    'email': 'email',
    'password': 'password'
  })
}

export const AuthErrorDto = {
  registerFields,
  loginFields
}
