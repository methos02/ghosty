import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useDraftsHead = () => {
  headService.set(
    computed(() => ({
      title: t('drafts.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
