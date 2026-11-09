import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useReadingStore } from '@/core-vue/stores/chapters/reading-store.js'
import { useNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

export const useChapterReading = ({
  readingStore = useReadingStore(),
  novelStore = useNovelStore(),
} = {}) => {
  const load = async (novelSlug, chapterId, options = {}) => {
    const response = await ChapterController.reading(novelSlug, chapterId, options)
    if (!ajaxHelper.isSuccess(response.status)) {
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
