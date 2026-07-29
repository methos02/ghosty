import { ref, readonly, inject } from 'vue'

export const NOVEL_STORE_KEY = Symbol('novel-store')

export const createNovelStore = () => {
  const novels = ref([])
  const isLoading = ref(false)
  const selectedNovel = ref()
  const currentChapter = ref()

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

  const serialize = () => ({
    novels: novels.value,
    selectedNovel: selectedNovel.value,
    currentChapter: currentChapter.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    novels.value = data.novels ?? []
    selectedNovel.value = data.selectedNovel
    currentChapter.value = data.currentChapter
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
    serialize,
    hydrate,
  }
}

export const useNovelStore = () => inject(NOVEL_STORE_KEY)
