import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const useChapterReading = () => {
  const readingStore = useReadingStore()
  const novelStore = useNovelStore()

  const load = async (novelSlug, chapterId) => {
    const response = await ChapterController.reading(novelSlug, chapterId)
    if (response.status !== STATUS.SUCCESS) {
      return response
    }

    novelStore.setSelectedNovel(response.novel)
    readingStore.setReading(response)

    return response
  }

  return {
    chapterReading: {
      load,
    },
  }
}
