import { form } from '@/services/services-helper.js'

export const validateLoginForm = (datas) => {
  const rules = {
    email: {
      rules: 'required|email',
      errors: {
        required: 'auth.login_error_email_required',
        email: 'auth.login_error_email_invalid'
      }
    },
    password: {
      rules: 'required',
      errors: {
        required: 'auth.login_error_password_required'
      }
    }
  }

  return form.validate(rules, datas)
}
