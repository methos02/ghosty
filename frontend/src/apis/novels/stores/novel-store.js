import { ref, readonly } from 'vue'

const novels = ref([])
const isLoading = ref(false)
const selectedNovel = ref()
const currentChapter = ref()

export const useNovelStore = () => {
  const setNovels = newNovels => {
    novels.value = newNovels
  }

  const setLoading = loading => {
    isLoading.value = loading
  }

  const setSelectedNovel = novel => {
    selectedNovel.value = novel
  }

  const clearSelectedNovel = () => {
    selectedNovel.value = undefined
    currentChapter.value = undefined
  }

  const setCurrentChapter = chapter => {
    currentChapter.value = chapter
  }

  return {
    novels: readonly(novels),
    isLoading: readonly(isLoading),
    selectedNovel: readonly(selectedNovel),
    currentChapter: readonly(currentChapter),
    setNovels,
    setLoading,
    setSelectedNovel,
    clearSelectedNovel,
    setCurrentChapter,
  }
}
