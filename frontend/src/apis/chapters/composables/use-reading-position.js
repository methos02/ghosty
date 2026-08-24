import { computed } from 'vue'
import { route } from '@/services/shortcuts/services-shortcut.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'

export const useReadingPosition = () => {
  const { branchChapterIds, isCurrentBranch } = useReadingStore()
  const currentRoute = route.current()

  const readChapterId = computed(() => Number(currentRoute.value.params.id))
  const position = computed(() => branchChapterIds.value.indexOf(readChapterId.value) + 1)
  const branchLength = computed(() => branchChapterIds.value.length)

  const chapterIdAt = requestedPosition => branchChapterIds.value[requestedPosition - 1]

  return {
    position,
    branchLength,
    isCurrentBranch,
    chapterIdAt,
  }
}
