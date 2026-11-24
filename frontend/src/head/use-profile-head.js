import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useProfileHead = profile => {
  headService.set(
    computed(() => ({
      title: t('profile_page.head_title', { username: profile.value?.username ?? '' }),
    })),
  )
}
