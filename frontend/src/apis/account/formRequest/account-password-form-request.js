import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

export const validateAccountPasswordForm = datas => {
  const rules = {
    currentPassword: {
      rules: 'required',
      errors: {
        required: 'common.error_current_password_required',
      },
    },
    password: {
      rules: `required|sizeMin:${ConfigLoader.get('account.passwordMinLength')}`,
      errors: {
        required: 'account_password_section.error_password_required',
        sizeMin: 'account_password_section.error_password_size_min',
      },
    },
    passwordConfirmation: {
      rules: 'required|passwordMatch',
      tests: {
        passwordMatch: (value, formData) => (value === formData.password ? '' : 'passwordMatch'),
      },
      errors: {
        required: 'account_password_section.error_password_confirmation_required',
        passwordMatch: 'account_password_section.error_password_confirmation_match',
      },
    },
  }

  return form.validate(rules, datas, { form: 'accountPassword' })
}
