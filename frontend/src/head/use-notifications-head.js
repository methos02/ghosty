import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useNotificationsHead = () => {
  headService.set(
    computed(() => ({
      title: t('notifications_page.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
