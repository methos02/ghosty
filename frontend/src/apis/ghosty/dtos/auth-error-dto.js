import { form } from '@/services/shortcuts/services-shortcut.js'

const registerFields = validationErrors => {
  return form.mapFields(validationErrors, {
    pseudo: 'register.pseudo',
    email: 'register.email',
    password: 'register.password',
    password_confirmation: 'register.passwordConfirmation',
  })
}

const loginFields = validationErrors => {
  return form.mapFields(validationErrors, {
    email: 'login.email',
    password: 'login.password',
  })
}

export const AuthErrorDto = {
  registerFields,
  loginFields,
}
