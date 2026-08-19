import { form } from '@/services/shortcuts/services-shortcut.js'

export const validateLoginForm = datas => {
  const rules = {
    identifier: {
      rules: 'required',
      errors: {
        required: 'auth.login_error_identifier_required',
      },
    },
    password: {
      rules: 'required',
      errors: {
        required: 'auth.login_error_password_required',
      },
    },
  }

  return form.validate(rules, datas)
}
