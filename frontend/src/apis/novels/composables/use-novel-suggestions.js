import { ref } from 'vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { STATUS } from '@/constants/ajax-constants.js'

const SUGGESTIONS_COUNT = 3

export const useNovelSuggestions = () => {
  const { selectedNovel } = useNovelStore()

  const suggestions = ref([])

  const loadSuggestions = async () => {
    const response = await NovelController.list()
    if (response.status !== STATUS.SUCCESS) {
      return
    }

    suggestions.value = response.novels
      .filter(novel => novel.id !== selectedNovel.value?.id)
      .slice(0, SUGGESTIONS_COUNT)
  }

  return {
    suggestions,
    loadSuggestions,
  }
}
