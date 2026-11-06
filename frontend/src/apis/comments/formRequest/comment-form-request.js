import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

export const validateCommentForm = (datas, formName) => {
  const rules = {
    content: {
      rules: `required|sizeMax:${ConfigLoader.get('comment.contentMaxLength')}`,
      format: formData => formData.content?.trim(),
      errors: {
        required: 'comment_fields.error_content_required',
        sizeMax: 'comment_fields.error_content_size_max',
      },
    },
  }

  return form.validate(rules, datas, { form: formName })
}
