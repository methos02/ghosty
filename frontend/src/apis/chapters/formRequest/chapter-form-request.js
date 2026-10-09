import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

export const validateChapterForm = datas => {
  const rules = {
    title: {
      rules: `required|sizeMin:${ConfigLoader.get('chapter.titleMinLength')}|sizeMax:${ConfigLoader.get('chapter.titleMaxLength')}`,
      errors: {
        required: 'chapter_manage.error_title_required',
        sizeMin: 'chapter_manage.error_title_size_min',
        sizeMax: 'chapter_manage.error_title_size_max',
      },
    },
    content: {
      rules: 'required',
      errors: {
        required: 'chapter_manage.error_content_required',
      },
    },
    summary: {
      rules: `required|sizeMax:${ConfigLoader.get('chapter.summaryMaxLength')}`,
      errors: {
        required: 'chapter_manage.error_summary_required',
        sizeMax: 'chapter_manage.error_summary_size_max',
      },
    },
  }

  return form.validate(rules, datas, { form: 'chapter' })
}
