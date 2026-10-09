import { form } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

const titleRules = `required|sizeMin:${ConfigLoader.get('chapter.titleMinLength')}|sizeMax:${ConfigLoader.get('chapter.titleMaxLength')}`

const novelFormRules = {
  'novel.title': {
    rules: titleRules,
    format: datas => datas.novel?.title,
    errors: {
      required: 'novel_manage.error_title_required',
      sizeMin: 'novel_manage.error_title_size_min',
      sizeMax: 'novel_manage.error_title_size_max',
    },
  },
  'novel.genreId': {
    rules: 'required',
    format: datas => datas.novel?.genreId,
    errors: {
      required: 'novel_manage.error_genre_required',
    },
  },
  'chapter.title': {
    rules: titleRules,
    format: datas => datas.chapter?.title,
    errors: {
      required: 'novel_manage.error_chapter_title_required',
      sizeMin: 'novel_manage.error_chapter_title_size_min',
      sizeMax: 'novel_manage.error_chapter_title_size_max',
    },
  },
  'chapter.content': {
    rules: 'required',
    format: datas => datas.chapter?.content,
    errors: {
      required: 'novel_manage.error_chapter_content_required',
    },
  },
  'chapter.summary': {
    rules: `required|sizeMax:${ConfigLoader.get('chapter.summaryMaxLength')}`,
    format: datas => datas.chapter?.summary,
    errors: {
      required: 'novel_manage.error_chapter_summary_required',
      sizeMax: 'novel_manage.error_chapter_summary_size_max',
    },
  },
}

export const validateNovelForm = datas => form.validate(novelFormRules, datas)
