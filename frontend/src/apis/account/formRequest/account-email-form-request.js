import { form } from '@/services/shortcuts/services-shortcut.js'

const accountEmailFormRules = {
  email: {
    rules: 'required|email',
    errors: {
      required: 'account_email_section.error_email_required',
      email: 'account_email_section.error_email_invalid',
    },
  },
  currentPassword: {
    rules: 'required',
    errors: {
      required: 'common.error_current_password_required',
    },
  },
}

export const validateAccountEmailForm = datas => {
  return form.validate(accountEmailFormRules, datas, { form: 'accountEmail' })
}
