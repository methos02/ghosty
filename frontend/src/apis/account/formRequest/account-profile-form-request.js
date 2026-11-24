import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

export const validateAccountProfileForm = datas => {
  const rules = {
    username: {
      rules: `required|sizeMin:${ConfigLoader.get('account.usernameMinLength')}|sizeMax:${ConfigLoader.get('account.usernameMaxLength')}`,
      format: formData => formData.username?.trim(),
      errors: {
        required: 'account_profile_section.error_username_required',
        sizeMin: 'account_profile_section.error_username_size_min',
        sizeMax: 'account_profile_section.error_username_size_max',
      },
    },
  }

  return form.validate(rules, datas, { form: 'accountProfile' })
}
