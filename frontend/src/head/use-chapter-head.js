import { computed } from 'vue'
import { ConfigLoader } from '@/config/config-loader.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { headService } from '@/head/head-service.js'
import { router } from '@/services/shortcuts/services-shortcut.js'

const shareDescription = chapter => {
  return [chapter.summary, chapter.author?.username && `par ${chapter.author.username}`]
    .filter(Boolean)
    .join(' — ')
}

export const useChapterHead = () => {
  const readingStore = useReadingStore()
  const { selectedNovel } = useNovelStore()

  const canonicalHref = chapter => {
    const resolved = router.resolve({
      name: 'chapter-read',
      params: { slug: selectedNovel.value?.slug, id: chapter.id },
    })

    return `${ConfigLoader.get('app.url')}${resolved.href}`
  }

  headService.set(
    computed(() => {
      const chapter = readingStore.chapter.value
      if (!chapter) {
        return {}
      }

      return {
        title: `${chapter.title} — ${selectedNovel.value?.title ?? ''}`,
        link: [{ rel: 'canonical', href: canonicalHref(chapter) }],
        meta: [
          { name: 'description', content: shareDescription(chapter) },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: chapter.title },
          { property: 'og:description', content: shareDescription(chapter) },
          { property: 'og:image', content: selectedNovel.value?.coverUrl ?? '' },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
      }
    }),
  )
}
