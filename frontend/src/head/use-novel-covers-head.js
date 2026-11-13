import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { headService } from '@/head/head-service.js'

export const useNovelCoversHead = novel => {
  headService.set(
    computed(() => ({
      title: t('novel_covers_page.head_title', { novel: novel.value?.title ?? '' }),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
