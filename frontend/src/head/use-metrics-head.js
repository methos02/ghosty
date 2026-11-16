import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useMetricsHead = () => {
  headService.set(
    computed(() => ({
      title: t('metrics_page.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
