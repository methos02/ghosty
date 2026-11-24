import { form } from '@/services/shortcuts/services-shortcut.js'

const accountDeletionFormRules = {
  currentPassword: {
    rules: 'required',
    errors: {
      required: 'common.error_current_password_required',
    },
  },
}

export const validateAccountDeletionForm = datas => {
  return form.validate(accountDeletionFormRules, datas, { form: 'accountDeletion' })
}
