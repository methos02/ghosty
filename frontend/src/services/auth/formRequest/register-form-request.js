import { form } from '@/services/services-helper.js'

export const validateRegisterForm = (datas) => {
  const rules = {
    pseudo: {
      rules: 'required|min:3|max:50',
      errors: {
        required: 'auth.register_error_pseudo_required',
        min: 'auth.register_error_pseudo_min',
        max: 'auth.register_error_pseudo_max'
      }
    },
    email: {
      rules: 'required|email',
      errors: {
        required: 'auth.register_error_email_required',
        email: 'auth.register_error_email_invalid'
      }
    },
    password: {
      rules: 'required|min:8',
      errors: {
        required: 'auth.register_error_password_required',
        min: 'auth.register_error_password_min'
      }
    },
    passwordConfirmation: {
      rules: 'required|password_match',
      tests: {
        password_match: (value, datas) => value !== datas.password ? 'password_match' : ''
      },
      errors: {
        required: 'auth.register_error_password_confirmation_required',
        password_match: 'auth.register_error_password_confirmation_match'
      }
    },
    acceptTerms: {
      rules: 'terms_accepted',
      tests: {
        terms_accepted: (value) => !value ? 'terms_accepted' : ''
      },
      errors: {
        terms_accepted: 'auth.register_terms_error'
      }
    }
  }

  return form.validate(rules, datas)
}
