import { computed, ref, watch } from 'vue'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { STATUS } from '@/constants/ajax-constants.js'

export const useLastFork = () => {
  const { chapter, ancestors } = useReadingStore()

  const forkChildren = ref([])

  const lastFork = computed(() => ancestors.value.findLast(ancestor => ancestor.childrenCount > 1))

  watch(chapter, () => {
    forkChildren.value = []
  })

  const openLastFork = async () => {
    const response = await ChapterController.children(lastFork.value.id)
    if (response.status !== STATUS.SUCCESS) {
      return
    }

    forkChildren.value = response.chapters
  }

  return {
    lastFork,
    forkChildren,
    openLastFork,
  }
}
