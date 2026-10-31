import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useWrittenChaptersHead = () => {
  headService.set(
    computed(() => ({
      title: t('written_chapters.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
