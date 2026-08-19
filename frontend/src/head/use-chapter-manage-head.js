import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useChapterManageHead = isEditing => {
  headService.set(
    computed(() => ({
      title: isEditing.value ? t('chapter_manage.title_edit') : t('chapter_manage.title_write'),
      meta: [
        { name: 'description', content: t('chapter_manage.subtitle') },
        { name: 'robots', content: 'noindex' },
      ],
    })),
  )
}
