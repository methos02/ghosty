import { form } from '@/services/shortcuts/services-shortcut.js'

const coverFormRules = {
  image: {
    rules: 'required',
    format: datas => datas.image?.name,
    errors: { required: 'cover_propose_dialog.error_image_required' },
  },
}

export const validateCoverForm = datas => {
  return form.validate(coverFormRules, datas, { form: 'cover' })
}