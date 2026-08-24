import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { headService } from '@/head/head-service.js'

export const useMultiverseHead = () => {
  const { selectedNovel } = useNovelStore()

  headService.set(
    computed(() => ({
      title: t('multiverse.head_title', { novel: selectedNovel.value?.title ?? '' }),
      meta: [{ name: 'robots', content: 'noindex' }],
    })),
  )
}
