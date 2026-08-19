import { computed } from 'vue'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { headService } from '@/head/head-service.js'

export const useNovelDetailHead = () => {
  const { selectedNovel } = useNovelStore()

  const shareDescription = computed(() => {
    const novel = selectedNovel.value
    if (!novel) {
      return ''
    }
    return [
      novel.title,
      novel.genre?.label,
      novel.author?.username && `par ${novel.author.username}`,
    ]
      .filter(Boolean)
      .join(' — ')
  })

  headService.set(
    computed(() => {
      if (!selectedNovel.value) {
        return {}
      }

      return {
        title: selectedNovel.value.title,
        meta: [
          { name: 'description', content: shareDescription.value },
          { property: 'og:type', content: 'book' },
          { property: 'og:title', content: selectedNovel.value.title },
          { property: 'og:description', content: shareDescription.value },
          { property: 'og:image', content: selectedNovel.value.coverUrl ?? '' },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
      }
    }),
  )
}
