import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useFavoritesHead = () => {
  headService.set(
    computed(() => ({
      title: t('favorites.title'),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
