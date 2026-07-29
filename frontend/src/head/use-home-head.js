import { computed } from 'vue'
import { t, route } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useHomeHead = () => {
  headService.set(
    computed(() => {
      if (route.current().value.name === 'novel-detail') {
        return {}
      }

      return {
        title: t('homepage.welcome_title'),
        meta: [
          { name: 'description', content: t('homepage.welcome_subtitle') },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: t('homepage.welcome_title') },
          { property: 'og:description', content: t('homepage.welcome_subtitle') },
        ],
      }
    }),
  )
}
