import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useReadingsHead = () => {
  headService.set(
    computed(() => ({
      title: t('readings.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
